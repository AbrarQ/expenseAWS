const aws = require('aws-sdk')
 require("aws-sdk/lib/maintenance_mode_message").suppress = true;
const linkmodel  = require('../models/downloadurlsModel');


async function uploadToS3(data, filename) {
    try{
      const BUCKET_NAME = process.env.BUCKET_NAME;
      const IAM_USER_KEY = process.env.IAM_USER_KEY;
      const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
  
  
  
      let s3Bucket =  new aws.S3 ({
          accessKeyId: IAM_USER_KEY,
          secretAccessKey : IAM_USER_SECRET,
          // Bucket : BUCKET_NAME
      })
  var params =  {
              Bucket : BUCKET_NAME,
              Key : filename,
              Body : data,
              ACL : ' public-read'
  
          }
          return new Promise((resolve,reject)=>{
              s3Bucket.upload(params,async(err,s3response)=>{
                  if (err){
                      console.log("AWS ERROR",err)
                      reject(err)
                  } else {
                      console.log("AWS success",s3response)
                       resolve  (s3response.Location);
                  }
              })
          })
    } catch(err){
      console.log(err)
      console.log("upload too s3")
      
    }
          
      } 






async function urlExport(url, userid){

   try{
    await linkmodel.create({

        userid : userid,
        url : url
   })
//    console.log("Db Updation done")
   
   } catch(e){
    console.log(e)
    console.log("url exp")
   }

   
}


async function urlsFetch(userid){

    try{
    const list = await linkmodel.findAll({
        where : { userid : userid}
     })
    console.log("Db fetch done")
    return list;
    
    } catch(e){
     console.log(e)
    }
 
    
 }
  
  
  module.exports= {
    uploadToS3,
    urlExport,
    urlsFetch 
    
  }