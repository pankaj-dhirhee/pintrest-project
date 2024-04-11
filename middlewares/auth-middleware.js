const jwt = require('jsonwebtoken');
const UserModel = require('../models/User.js');
let session = require('express-session');

// Function to check if user is authenticated or not
var checkUserAuth = async (req, res, next) =>{
	let token = "";
	// Getting token from request header
	const authorization = req.cookies.authorization;
	
	// If that token starts with Bearer then...
	if(authorization && authorization.startsWith('Bearer')) {
	  try{
	    /*
	      Spliting that given authentication token
	      > Our given token is like 'Bearer and-here-will-be-token'
	      > And getting its token part only
	    */
		  token = authorization.split(' ')[1];
		  
		  // Getting userId by decoding that token
		  const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY);
		  // Getting user from session
		  let sessionUser = req.session.user;
		 
		 // If there is user in session then return from here, no need to find user in db
		 // This will decrease the overall latency
		 if(sessionUser){
		   req.user = sessionUser
		   return next();
		 }
		 
		  // Getting user by it's id
		  let user = await UserModel.findById(userID).select('-password');
		  req.user = user;
		  req.session.user = user;
		  
		  // If user's email is authenticated then run next()
		  if (user.isEmailAuthenticated == true){
		    next();
		  }
		  // Else, if user's email is not authenticated then redirect to email-not-verified page
		  else{
		    res.redirect(`/api/user/email-not-verified/${user._id}`);
		  }
	  }
	  // If any error acured then send that, failed, Unauthorized User
	  catch(error){
	    console.log(error);
	    res.clearCookie('authorization')
	    res.redirect("/api/user/signin");
	    /* res.status(401).send({
	      "status": "failed",
	    	"message": "Unauthorized User"
	    }); */
	  }
	} // If condition
	
	// If token is not present then the user is not authorized. redirect to sign-in page
	if (!token ){
		res.redirect("/api/user/signin");
	}
} // Ending of checkUserAuth Function 

module.exports = checkUserAuth;