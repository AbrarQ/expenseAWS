const usersModel = require('../models/userLoginsModel')
const helperFunction = require('../services/functions')
const path = require('path')
const linkModel = require('../models/resetPassLinkStatusModel')
const sequelize = require('../util/dbConnection');
const bcrypt = require('bcrypt');

/**
 * HOME FOR PASSWORD ROUTES
 * RESET PASSWORD
 * SEND HTML ,SEND JS
 * STORE UPDATED PASSWORD IN DATABASE
 */





exports.passwordEmailer = async (req, res, next) => {
    try{
        const mail = req.body.emailid;
    const uuidx = req.middlewareUUID;
    // console.log(uuidx, "is the last step")
   

    const Sib = require('sib-api-v3-sdk');

    const client =  Sib.ApiClient.instance;

    const apiKey =  client.authentications['api-key'];
    apiKey.apiKey = process.env.API_KEY;

    // create a transactional email message
    let sendSmtpEmail = new Sib.SendSmtpEmail();
    sendSmtpEmail.to = [{ "email": mail }];
    sendSmtpEmail.sender = { "email": "abrarquraishi96@gmail.com", "name": "Abrar" };
    sendSmtpEmail.subject = "Reset-Password";
    sendSmtpEmail.textContent = "Hey Click below to reset Your Password";
    sendSmtpEmail.htmlContent = `<a href="http://localhost:4000/password/resetpassword/${uuidx}">Reset Password</a>`;
    console.log(sendSmtpEmail.htmlContent)

    // send the email
    const apiInstance = new Sib.TransactionalEmailsApi();
    apiInstance.sendTransacEmail(sendSmtpEmail)
        .then(
            res.json({ message: "Email sent successfully.", uuid :uuidx })
        )
        
    }catch(err){
      res.status(500).json({ error: err, message: false })
      console.log(err); console.log("error at reset pass")}
    



}


exports.sendhtml = async (req, res, next)=> {
  // console.log("sendinfìg html file")
  // res.set({'Content-Security-Policy' : "script-src 'self'"});
  //    res.sendFile(path.join(__dirname, '../public/password/SetNewPass.html'))
  const uuid =  req.params.uuid;
  console.log("uudi is sending to link sendhtml",uuid)
  res.status(200).send(`<html>
  <script>
      function formsubmitted(e){
          e.preventDefault();
          console.log('called')
      }
  </script>
  <form action="/password/updatepassword/${uuid}" method="get">
      <label for="newpassword">Enter New password</label>
      <input name="newpassword" type="password" required></input>
      <button>reset password</button>
  </form>
</html>`
)
res.end()

}
    

  
// exports.sendjs = async (req, res) => {
//   console.log("hi")
//   res.set('Content-Type', 'application/x-javascript');
//   res.sendFile(path.join(__dirname, '../public/password/Passwords.js'))
// };
  
  
  
  
 
  
  
  exports.storepass = async (req, res, next) => {
  try{
    const t = await  sequelize.transaction();
  console.log("entering store pass",req.url)
    const userID = await helperFunction.userID(req.params.uuid)
    console.log(userID)
    if(userID.isactive ===0){
      console.log("cant use me")
      res.status(301).json({error : "Url Expired!!!", success: false});
    }  else {
  
    const pass = await req.query.newpassword
  console.log(pass)
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(pass, salt)
  
  
  
    const passUpdate = await usersModel.update({
      
      password: hashedPass
    }, { where: { id: userID.userloginId }, transaction: t })
      .then(async (response) => {
  
        const uuidUpdate = await linkModel.update({
          isactive: false
        }, { where: { userloginId: userID.userloginId }, transaction: t })
  
          .then(async () => {
            await t.commit();
            res.status(200).json({ message: "Password Updated Successfully" })
            
          })
          .catch(async (err) => {
            await t.rollback();
            res.status(500).json({ error: err, message: false})
          })
      })
      .catch(async (err) => {
        await t.rollback();
        res.status(500).json({ error: err, message: false })
      })
  
    }
  }catch(err){console.log(err); console.log("error at store pass")}
   
  
  
  
  
  
  
  
  
  
  }
  
  
  
  
