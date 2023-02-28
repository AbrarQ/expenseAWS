
const usersModel = require('../models/userLoginsModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')




function generateAuthToken(id){
    return  jwt.sign({userId : id}, process.env.JWT_SECRET_KEY)
}

function generateAuthToken(id,key){
    return  jwt.sign({userId : id, ispremium:key}, process.env.JWT_SECRET_KEY)
}
/**
 * HOME FOR SIGNIN ROUTES
 * GET USERS WITH WHERE CONDITION
 */
exports.getUsers = async (req, res, next) => {


    try {

        const user = req.body.userName;
        console.log(user)
        
        
    
    
            const allData = await usersModel.findAll({ where: { name: user } }).then(response => response)
             .catch(async(err)=> res.status(500).json({err}))
            const check = JSON.stringify(allData);
            const final = JSON.parse(check)
            console.log(final[0])
    
            if (final.length==0){
                res.status(404).send();
            
            } else{
            const hashPass = final[0].password
            const pass = req.body.passwrd;
            const comparePass = await  bcrypt.compare(pass,hashPass);
    
            console.log(comparePass); 
    
            if (comparePass == false) {
                console.log("sending 401")
               res.status(401).json({message: "Incorrect Password"})
            } else if (comparePass == true) {
                console.log(final[0].ispremium)
                if (final[0].ispremium==="1"){
                    console.log("user is premium")
    
                    res.status(200).json({token :  generateAuthToken(final[0].id, "True"),message : "Login done as Premium User"})
            } else {
                console.log("user is not premium")
                res.status(200).json({token :  generateAuthToken(final[0].id, "False"),message : "Login done"})
            }
                }}
    } catch(err){
console.log(err);
console.log("error at sigin ctrl")
    }
    }
    





// exports.resetPass = async( req, res, next)=> {
//     const mail  = req.body.emailid;
    
//  const Sib = require('sib-api-v3-sdk');

//  const client = Sib.ApiClient.instance;

//  const apiKey = client.authentications['api-key'];
// apiKey.apiKey = process.env.API_KEY;

// // create a transactional email message
// let sendSmtpEmail = new Sib.SendSmtpEmail();
// sendSmtpEmail.to = [{ "email": mail}];
// sendSmtpEmail.sender = { "email": "abrarquraishi96@gmail.com", "name": "Abrar" };
// sendSmtpEmail.subject = "Reset-Password";
// sendSmtpEmail.textContent = "Hey Click here to reset Your Password";
// sendSmtpEmail.htmlContent = "<a href='https://www.google.com/'>Google.com</a>";

// // send the emai
// const apiInstance = new Sib.TransactionalEmailsApi();
// apiInstance.sendTransacEmail(sendSmtpEmail)
//   .then(
//    res.status(200).json({message : "Email sent successfully."})
//   )
//   .catch((err)=> {
//     res.status(500).json({error : err, message : false})
// });



// }


