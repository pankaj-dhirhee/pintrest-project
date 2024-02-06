const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController.js');
const checkUserAuth = require('../middlewares/auth-middleware.js');
const jwt = require('jsonwebtoken');



// Route level middleware to protect the route =>
// 1. applying checkUserAuth middleware to change-password route
router.use('/changepassword', checkUserAuth);
// 2. applying checkUserAuth middleware to get-data-of-loggedIn-user route
router.use('/loggeduser', checkUserAuth);
// 3. applying checkUserAuth middleware to logout route
router.use('/logout', checkUserAuth);



// public route [ For api ] =>
// 1. Route to register the user
router.post('/register', UserController.userRegistration);
// 2. Route to send email verification link
router.post('/send-email-verification-link', UserController.sent_email_verification_mail);
// 3. Route to verify user's email 
router.post('/verifyemail', UserController.verify_user_email);
// 4. Route to login the user
router.post('/login', UserController.userLogin);
// 5. Route to send-reset-password-email
router.post('/send-reset-password-email', UserController.sendUserPasswordResetEmail);
// 6. Route to reset the user's password
router.post('/reset-password/:id/:token', UserController.userPasswordReset);
// 7. Route to logout the user
router.get('/logout', UserController.logout_the_user);



// Protected routes
// 1. Route to cahnge the password
router.post('/changepassword', UserController.changeUserPassword);
// 2. Route to get-data-of-logged-in-user
router.get('/loggeduser', UserController.loggedUser);



// Static route for rendering different pages
// 1. Rendering sign in page it itself contain login, reset-password etc.. forms
router.get("/signin", (req, res)=>{
	res.render("sign-in");
});

// 2. Rendering email verification page, in this page your can verify email
router.get('/email-verification/:verify_email_token', (req, res)=>{
  res.render("email-verification", {
    info: req.params.verify_email_token
  });
});

// 3. Rendering email-not-verified-page
router.get("/email-not-verified/:userid", (req, res) =>{
  let user_id_in_db = req.params.userid;
  res.render("email-not-verified", {
    userid: user_id_in_db
  });
});

// 4. Rendering reset-password form
router.get("/reset/:id/:token", (req, res)=>{
  /* 
    > Here id is id of user in database
    > Here token is usnique reset-password token valid for 15 minutes only
    > For resetting password =>
     1. User will give its email in send-reset-password form.
     2. The we will send reset password link in user's email.
     3. That link in sent in email, contaions id of user in databae and newly generated token
     4. And by clicking that link in email, user will reach to this route.
  */
  const { id, token } = req.params;
  res.render("reset-password", {id, token});
});

// 5. Rendering change password form
router.get("/change-password", (req, res)=>{
  res.render("change-password");
});

module.exports = router;