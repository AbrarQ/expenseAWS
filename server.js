const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const sequelize = require('./util/dbConnection');
const Expense = require('./models/expensesModel');
const User = require('./models/userLoginsModel');
const forgotPass = require('./models/resetPassLinkStatusModel');
const path = require('path')
const uuid = require('uuid')
const cors = require('cors');
const helmet = require('helmet')
const compression = require('compression')
const fs = require('fs')
const https =require('https')
const axios = require('axios')
app.use(express.static('public'))

require("dotenv").config();
app.use(cors())
// app.use(helmet())
app.use(compression())


const signuproutes = require('./routes/signupRoute');
const signinroutes = require('./routes/signinRoute');
const expenseroutes = require('./routes/expenseRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const premiumUserRoutes = require('./routes/premiumRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const morgan = require('morgan');
const LogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags : 'a'})
app.use(morgan('combined',{ stream : LogStream }) )

app.use('/signup',signuproutes);
app.use('/signin',signinroutes);
app.use('/expense',expenseroutes);
app.use('/purchase',purchaseRoutes);
app.use('/premium',premiumUserRoutes);
app.use('/password',passwordRoutes);

  
  
app.use((req, res)=>{
    try{  console.log("url", req.url );
    res.sendFile(path.join(__dirname,`public/${req.url}`));
  
   
}catch(e){ console.log("ERr is from here")}
  
})


const privateKey =  fs.readFileSync('server.key')
const certificate = fs.readFileSync('-server.cert')


User.hasMany(Expense);
Expense.belongsTo(User)

User.hasMany(forgotPass);
forgotPass.belongsTo(User)



   sequelize.sync().then(result => 
    {
        console.log(result)
    }).catch(err => {
        console.log(err)
    })


// 3.215.181.196

// https.createServer({key :privateKey , cert :certificate},app)
app.listen(4000);
 
