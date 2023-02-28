const express = require('express');
const router = express.Router();
const uuidMiddleware = require('../middleware/uuidFunctions');
const passwordController = require('../controllers/passwordsController');


router.post('/forgotpassword',uuidMiddleware.uuidDbCheck, passwordController.passwordEmailer);

router.get('/resetpassword/:uuid', passwordController.sendhtml  );
router.get('/updatepassword/:uuid', passwordController.storepass );



// router.get('/updatepassword/:resetpasswordid', resetpasswordController.updatepassword)

// router.get('/resetpassword/:id', resetpasswordController.resetpassword)--html
// router.get('/resetpassword/Passwords.js',passwordController.sendjs);
// router.post('/resetpassword/Passwords.js',passwordController.sendjs);




module.exports = router;



// router.get('/Setpass.js', resetControl.sendjs);