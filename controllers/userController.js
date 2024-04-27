const UserModel = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {transporter, brevo_email_transporter} = require('../config/emailConfig.js');
const send_responce = require("../helpers/send-responce.js");
const functions_needed_for_google_auth = require("../utils/functions-related-to-google-auth.js");



// This is a class all the functions are inside this 
class UserController{
 // Authentication System 1 => Local authentication
  
 // 1. Function to register the user
 static userRegistration = async (req, res) => {
	 try{
	 	// Getting required information of user from request body
	  const {username, fullname, email, password, password_confirmation} = req.body;
		// Getting user from database
    const user = await UserModel.findOne({email: email});
		/*
		  If user found then it means =>
		  > User already exist with the given email
		  > In this case we will send that, email already exist
		  > If we dont do this then user can register with same email multiple times
		*/
		if(user){
		  res.send({
				"status": "failed",
				"message": "Email already exists"
			});
		}
		// Else, means if user is not found with the given email then...
		else{
		  // We are checking that if all the fields are given then...
		  if(username && fullname && email && password && password_confirmation){
		  	/* 
		  	  If password and confirm password is same then =>
		  	  > Hash the password 
		  	  > save that to database, means register the user
		  	*/
				if(password == password_confirmation){
					// Here we are trying to register the user
				  try{
				  	// Bcrypt salt method
						const salt = await bcrypt.genSalt(10);
						// Password will be hashed and saved here
					  const hashPassword =  await bcrypt.hash(password, salt)
					  // Inserting user data into the database, doc means document
					  const doc = new UserModel({
				  	  username: username,
				  	  fullname: fullname,
				  	  email: email,
				  	  password: hashPassword,
				  	  accountType: "Local",
				  	  boards: ["Your uploads"]
				    });
				    await doc.save();
				    
				    // Getting the resently saved user by its given email from request body
				    const saved_user = await UserModel.findOne({
				    	email: email
				    });
				    
				    // Generating token to verify email, token contains users-id-of-db 
				    let email_verify_token = jwt.sign({userID: saved_user._id}, process.env.JWT_SECRET_KEY, { expiresIn: '15m' });
				    // Generating a link to verify email this link contains that generated token
				    let email_verify_link = `${process.env.BASE_URL}/api/user/email-verification/${email_verify_token}`; 
				    
				    // Sending email verification mail to the user
				    // In this 'info' variable details will come like -> email is send or not
				    let info = "";
				    try{
        	    // Send Email to user who wants to reset password
            	info = await transporter.sendMail({
            		from: process.env.GMAIL_SMTP_EMAIL_FROM,
            	  to: saved_user.email,
            	  subject: "Email verification link",
            	  html: `<a href=${email_verify_link}> Click Here </a> to verify your email`
            	});
          	} catch (error){
          	  console.log(error)
          	  return res.send({
          	    "status": "failed",
          			"message": "Please give your valid email, so that we can send verify email link",
          	  })
          	}
				    
				    // Generating JWT token to set in cookie, contsins user-id-of-db
				    const token = jwt.sign({userID: saved_user._id}, process.env.JWT_SECRET_KEY, { expiresIn: '60d' });
				    // Setting token as cookie to client browser for 60 days
				    res.cookie('authorization', `Bearer ${token}`, {
				    	expires: new Date(Date.now() + (60 * 24 * 60 * 60 * 1000)), 
				    	httpOnly: true 
				    });
				    
				    /* 
				      > Destroying current sessiobn of user, if we dont do this then =>
				      > User will be logged inwith his old account even after registering new account.
				    */
				    
				    if(req.session){
				      req.session.destroy(); 
				    }
				    
				    // Sending responce
				    res.status(201).send({
				    	"status": "success",
				    	"message": "Registration success, please check your email to verify your email",
				    	"token": token
				    });
					}catch(error){
						console.log(error);
						// Sending responce
						res.send({
				      "status": "failed",
				      "message": "Unable to register"
			      });
					}
				}
				// Else means if passwors and confirm password doesn't match
				else{
					res.send({
				    "status": "failed",
				    "message": "Password and confirm password doesn't match"
			    });
				}
			}
			// Else, means if any field is not given then send that, all fields are required 
			else{
				res.send({
				  "status": "failed",
				  "message": "All fields are required"
			  });
			}
		} // Else condition
	 }catch(error){
	 	console.log(error)
	   res.send({
		   "status": "failed",
			 "message": "All Fields are required"
		 }); 
	 }
 } // End of user registrstion
	
	
	
 // 2. Function to login User
 static userLogin = async (req, res) =>{
   try{
   	// Getting email and password from request body
	   const {email, password} = req.body;
		 // If email and password is given then
		 if(email && password){
		 	 // Getting user by his email given in request body
		   const user = await UserModel.findOne({
					email: email,
			 });
			 // If user is not null then login the user and generate a new token
			 if(user != null){
			   // Checking that the given password is correct or not, by bcrypt. Because the password in the database is hashed password
			   const isMatch = await bcrypt.compare(password, user.password);
			   // If email and the pasword is matched then Login the user and generate a new token
				if((user.email === email) && isMatch){
						// Generating jwt token
				    const token = jwt.sign(
				      { userID: user._id }, 
				      process.env.JWT_SECRET_KEY, 
				      { expiresIn: '60d' }
				    );
				    // Setting token as cookie to client browser for 60 days
				    res.cookie('authorization', `Bearer ${token}`, {
				    	expires: new Date(Date.now() + (60 * 24 * 60 * 60 * 1000)), 
				    	httpOnly: true 
				    });
				    /* 
				      > Destroying current sessiobn of user, if we dont do this then =>
				      > User will be logged inwith his old account even after login to new account.
				    */
				    if(req.session){
				      req.session.destroy(); 
				    }
				    
				    if(user.isEmailAuthenticated == false){
				      // Sending responce that, login is success
  						return res.send({
  						  "status": "failed",
  						  "message": "Your email is not verified",
  						  "userid": user._id
  					  });  
				    }
				    
				    // Sending responce that, login is success
						res.send({
						  "status": "success",
						  "message": "Login Success",
						  "token": token
					  });
					}
					// Else, if  the given email and password did not match then login failed
					else{
						res.send({
						  "status": "failed",
						  "message": "Email or password is not valid"
					  });
					}
				}
				// Else, If user is null then this user is not registered accound 
				else{
					res.send({
						"status": "failed",
						"message": "You are not a Registered user"
					});
				}
			}
			// Else, if email or password field is not given then send that, all the fields are required
			else{
				res.send({
					"status": "failed",
					"message": "All Fields are required"
				})
			}
		}
		// If any error accured then send that, unable to login
		catch(error) {
			console.log(error);
			res.send({
				"status": "failed",
				"message": "Unable to Login"
			})
		}
 } // Ending of login function
 
 
 
 // 3. Function to change the password	
 static changeUserPassword = async (req, res) =>{
   const requested_user = req.user;
   console.log(`requested_user: ${requested_user}`)
   if(requested_user.accountType == "Google"){
     return send_responce(res, 409, "Failed", "This is a google account, Here is no system of password")
   }
   
   
 	 // Getting password and confirm password from request body
   const {password, password_confirmation} = req.body;
   
   // If If the field password and password_confirmation is given then... 
	 if(password && password_confirmation){
	 	 // If confirm password is not = password then send that password and confirm doesn't match 
	   if(password !== password_confirmation){
		   res.send({
			   "status": "failed",
				 "message": "New Password and Confirm New Password doesn't match"
		   });
		 }
		 // Else, if password and confirm password is matched then change the user password. Because we are working on change password function
		 else{
		 	 // bcrypt salt method
		   const salt = await bcrypt.genSalt(10);
		   // Password will be hashed and saved here
			 const newHashPassword = await bcrypt.hash(password, salt);
			 // Updating user password to given password because we are changing the password
			 let changes = await UserModel.findByIdAndUpdate(
			   req.user._id, 
				 {  $set: { password: newHashPassword }  }
			 );
			 
			 // Finding user on database
			 let user = await UserModel.findById(req.user._id);
			 // Sending responce that, password changed successfully
			 res.send({
			   "status": "Success",
			   "message": "Password changed successfully"
			 });
		 } // Else condition
	 } else{
	   res.send({
		   "status": "failed",
			 "message": "All Fields are Required"
		 })
	 }
 } // End of change password function
	
	
 
 // 4. Function to get data of logged in user
 static loggedUser = async (req, res) =>{
  	res.send({ "user": req.user }); 
 } // End of loggedUser Function
  
  
  
 // 5. Function to send reset password email 
 static sendUserPasswordResetEmail = async (req, res)=>{
 	// Getting user email from request body
  const { email } = req.body;
  
  // If email is given then... 
  if(email){
  	// Getting user from database by given email
    const user = await UserModel.findOne({email: email});
    
    // If the account type is Google then we cannot change password
    if(user.accountType == "Google"){
      return send_responce(res, 409, "Failed", "This is a google account, Here is no system of password")
    }
    
      // If user found then...
      if(user){
      	// Getting secret key for jwt token from invironment variable
        const secret = user._id + process.env.JWT_SECRET_KEY;
        // Generating new token for reset password, it contains user id 
      	const token = jwt.sign({ userID: user._id }, secret, {expiresIn: '15m'});
      	// Generating link for reset password
      	const link = `${process.env.BASE_URL}/api/user/reset/${user._id}/${token}`;
      	
      	// Here Object will come to send email using node mailer
      	let info = "";
      	/*
      	  > Sending reset password email to the user who want to reset password.
      	  > This is wrapped inside try catch because =>
      	  > If user is given wrong email then this will give error
      	*/
      	try{
        	// Send Email to user who wants to reset password
        	info = await transporter.sendMail({
        		from: process.env.GMAIL_SMTP_EMAIL_FROM,
        	  to: user.email,
        	  subject: "Your password reset Link",
        	  html: `<a href=${link}> Click Here </a> to reset your password`
        	});
      	} catch (error){
      	  return res.send({
      	    "status": "failed",
      			"message": "May be you have not given your valid email address while registering",
      	  })
      	}
      	
      	// Send responce that, Email sent successfully	
      	res.send({
      			"status": "success",
      			"message": "Password Reset Email Sent... Please Check Your Email",
      			"info": info
      	})
      }
      // Else, if user is not found in database then user is not registered or wrong email is given
      else{
      	// Sending responce that, email doesn't exist
        res.send({
  			    "status": "failed",
  			    "message": "Email doesn't exist"
  	    });		
      }
    }
    // Else, if email is not given
    else{
      res.send({
  		  "status": "failed",
  			"message": "Email field is required"
      });
    }
 } // Ending of sendUserPasswordResetEmail Function
  
  

 // 6. Function to reset user's password
 static userPasswordReset = async (req, res) => {
 	 // Getting password and Confirm password from request body
   const {password, password_confirmation} = req.body;
   // Getting user id and token from request params
   const { id, token } = req.params;
   // Getting user from database by given user id
   const user = await UserModel.findById(id);
   // Generating new token for user
   const new_secret = user._id + process.env.JWT_SECRET_KEY;
   
   try{
   	 // If token and new token is matching then, token has user id
   	 // Here we  are checking that, if given user id and user id from database is matching or not
     jwt.verify(token, new_secret);
     
     // If password and Confirm password is given then... 
  	 if(password && password_confirmation){
  	 	 // If password and confirm password is not same then send that, New password and confirm password doesn't match
  	   if(password !== password_confirmation){
  		   res.send({
  			   "status": "failed",
  			   "message": "New Password and Confirm New Password doesn't math"
  		   });
  		 }
  		 // Else, if password and confirm password is matched then reset the password of user
  		 else{
  		 	 // Bcrypt salt method
  		   const salt = await bcrypt.genSalt(10);
  		   // Password will be hashed and saved here 
				 const newHashPassword = await bcrypt.hash(password, salt);
				 // Updating password of user to given new password
				 await UserModel.findByIdAndUpdate(
				   user._id, {  $set: { password: newHashPassword }  }
				 );
				 // Sending responce that password reset successfully
				 res.send({
  			   "status": "Success",
  			   "message": "Password Reset Successfully"
  		   });	   
  		 }
  	 }
  	 // Else, if password and Confirm password is not given, then send responce that, all fields are required 
  	 else{
  	   res.send({
  		   "status": "failed",
  			 "message": "All Fields are required"
  		 });
  	 }
   }
   // If any error accured then send that, failed, invalid token 
   catch(error){
     console.log(error);
  	 res.send({
  	   "status": "failed",
  		 "message": "invalid token"
  	 });
   }
 } // End of userPasswordReset
 
 
 
 // 7. Function to send email verification link
 static sent_email_verification_mail = async (req, res) =>{
   // Finding user from data base by userid
   let user_from_db = await UserModel.findOne({
     _id: req.body.userid
   });
   
   // Generating a token that contains user-id-of-db
   let email_verify_token = jwt.sign({userID: user_from_db._id}, process.env.JWT_SECRET_KEY, { expiresIn: '15m' });
   // Generating link that will be send to user's mail to verify the email
	 let email_verify_link = `${process.env.BASE_URL}/api/user/email-verification/${email_verify_token}`
   
   // Sending verify email link to the user
   let info = "";
	 try{
      // Send Email to user who wants to reset password
      info = await transporter.sendMail({
        from: process.env.GMAIL_SMTP_EMAIL_FROM,
        to: user_from_db.email,
        subject: "Email verification link",
        html: `<a href=${email_verify_link}> Click Here </a> to verify your email`
      });
   } catch (error){
      console.log(" node mailer error while sending email verification link = " + error);
      return res.send({
        "status": "failed",
        "message": "Please give your valid email",
      });
   }  
          	
   res.send({
     "status": "success",
     "message": "Email verification link sent, please check your email"
   });
 } // Ending of sent_email_verification_mail function
 
 
 
 // 8. Function to verify the email
 static verify_user_email = async (req, res) =>{
   // Getting the verify email token that contains user-id-of-db
   let email_verify_token = req.body.verify_email_token;
   
   // Token will decode and it's value will come here
   let token_data = "";
   // Decoding token data
   try{
     token_data = jwt.verify(email_verify_token, process.env.JWT_SECRET_KEY);  
   }
   // If it is giveing error means it is invalid token or expired token
   catch(error){
     console.log(error);
     return res.send({
       "status": "failed",
       "message": "Your token has been expired"
     });
   }
   
   // Setting value of field 'isEmailAuthenticated' = true, now email is verified
   let updatedUser = await UserModel.updateOne(
     {_id: token_data.userID},
     {$set: { isEmailAuthenticated: true } }
   );
   
   // Sending success message
   res.send({
       "status": "success",
       "message": "Your email is verified Successfully"
   })
 } // Ending of verify_user_email function
 
 
 
 // 9. Function to logout the user
 static logout_the_user = async (req, res) => {
   if(req.session){
		 req.session.destroy(); 
	 }
   res.clearCookie("authorization");
   res.redirect("/api/user/signin");
 } // End of logout_the_user function
 
 
 //=============================================//
 
 
 // Authentication System 2 => Google authentication

 // 1. Register user with google oauth
 static google_callback_handler = async (req, res) => {
   const code = req.query.code;
   
   try{
     const google_redirect_uri = process.env.GOOGLE_CALLBACK_URL;
     
     const {id_token, access_token} = await functions_needed_for_google_auth.getGoogleOAuthTokens({
       code, google_redirect_uri
     });
     const googleUser = await functions_needed_for_google_auth.getGoogleUser({
       id_token, access_token
     });
     /* googleUser looks like this 
        {
          "googleUser": {
            "id": "1234567890",
            "email": "useremail@gmail.com",
            "verified_email": true,
            "name": "User's full name",
            "given_name": "It is username",
            "family_name": "Here will be surname",
            "picture": "Url of user's profile image"
          }
        } 
     */
     
     
     // Getting the user from mongodb with given email 
     const user_in_db_with_given_email = await UserModel.findOne({
       email: googleUser.email
     });
     // If user found with the given email, then give a responce and return from here
     if(user_in_db_with_given_email){
       return send_responce(
         res, 
         409, 
         "failed", "Email already exists. Try again with different google account"
       );
     };
     
     
     // If the given email of the user is not verified by google then return with a responce
     if(googleUser.verified_email != true){
       return send_responce(
         res, 
         409, 
         "failed", "Your email verified. Try again with different google account or go to your google account and verify your email"
       );
     };
     
     
     // Preparing a document of user that will be inserted to database
     const document_to_be_inserted_in_db = new UserModel({
       username: googleUser.given_name,
			 fullname: googleUser.name,
			 email: googleUser.email,
			 password: "No password bacause this is google account",
			 accountType: "Google",
			 boards: ["Your uploads"],
			 isEmailAuthenticated: true,
     });
     await document_to_be_inserted_in_db.save();
      
      
     const saved_user_from_db = await UserModel.findOne({
       email: googleUser.email
     });
     
     // Generating JWT token to set in cookie, contains user-id-of-db
		 const token = jwt.sign({
		   userID: saved_user_from_db._id
		 }, process.env.JWT_SECRET_KEY, { expiresIn: '60d' });
		 
     // Setting token as cookie to client browser for 60 days
		 res.cookie('authorization', `Bearer ${token}`, {
			 expires: new Date(Date.now() + (60 * 24 * 60 * 60 * 1000)), 
			 httpOnly: true
		 });
     
     res.redirect("/api/user/redirect-to-profile-page");
     // res.redirect("/profile");
   }catch(error){
     console.log(`[ ${error}, "Failed to authorize google user while registration"]`)
     return res.redirect("/api/user/signin")
   }; 
 }; // End of google_callback_handler function
 
 
 
 // 2. Login user with google
 static login_with_google = async  (req, res) => {
   console.log("From: Google login route");
   const code = req.query.code;
   
   
   
   try{
     // This session contains a user object. We are destroying it
     if(req.session){
			req.session.destroy(); 
		 }
     
     const google_redirect_uri = process.env.GOOGLE_CALLBACK_URL_FOR_LOGIN;
     const {id_token, access_token} = await functions_needed_for_google_auth.getGoogleOAuthTokens({
       code, google_redirect_uri
     });
     const googleUser = await functions_needed_for_google_auth.getGoogleUser({
       id_token, access_token
     });
     /* googleUser looks like this 
        {
          "googleUser": {
            "id": "1234567890",
            "email": "useremail@gmail.com",
            "verified_email": true,
            "name": "User's full name",
            "given_name": "It is username",
            "family_name": "Here will be surname",
            "picture": "Url of user's profile image"
          }
        } 
     */
     
     
     // If the given email of the user is not verified by google then return with a responce
     if(googleUser.verified_email != true){
       return send_responce(
         res, 
         409, 
         "failed", "Your email verified. Try again with different google account or go to your google account and verify your email"
       );
     };
     
     
     // Getting user from db with then information given by the google
     const saved_user_from_db = await UserModel.findOne({
       email: googleUser.email
     });
     
     // If user did not found in db then send failed message 
     if(!saved_user_from_db){
       return send_responce(
         res, 
         409, 
         "failed", "This account is not registered. First resister it"
       );
     };
     
     
     // Generating JWT token to set in cookie, contsins user-id-of-db
		 const token = jwt.sign({
		   userID: saved_user_from_db._id
		 }, process.env.JWT_SECRET_KEY, { expiresIn: '60d' });
			
     // Setting token as cookie to client browser for 60 days
		 res.cookie('authorization', `Bearer ${token}`, {
			 expires: new Date(Date.now() + (60 * 24 * 60 * 60 * 1000)), 
			 httpOnly: true
		 });
     
     res.redirect("/api/user/redirect-to-profile-page")
     // res.redirect("/profile");
   }catch(error){
     console.log(error)
     console.log(`[ ${error}, "Failed to login with google"]`);
     return res.redirect("/api/user/signin");
   }; 
 }; // End of login_with_google function
 
}; // End of class UserController

module.exports = UserController;