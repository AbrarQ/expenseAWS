const usersModel = require('./userLoginsModel')

module.exports = async function (userName){

    const allData = await usersModel.findAll({ where: { name: userName } })
    .then(response => response)
    .catch(async(err)=> res.status(500).json({err}))
    
    try {
        const check = JSON.stringify(allData);
        const final = JSON.parse(check)
        
        if(final.length >0){
            console.log("Already exists")
            console.log(final[0].name)
    
            return -1;
    

        } else{
        console.log("no such user found ")
    
        return 0;
        }
        

    } catch(err){
        res.status(500).json({error : err})
    }
   
    

};





