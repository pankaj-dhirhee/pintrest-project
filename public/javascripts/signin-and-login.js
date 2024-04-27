// Sign in form 
const sign_in_form = document.getElementById("sign-in-form");
// Login form
let login_form = document.getElementById("login-form");
// Loader container inside register account butt5on
const loader_inside_register_btn = document.getElementById("loader-inside-register-btn");
// A button in sign in form by clicking it you can go to login form
const go_to_login_btn = document.querySelector(".go-to-login-form");
// Container for login side 
const loginPage = document.querySelector(".login-side-container");
// Contsiner for signin side
const signInPage = document.querySelector(".signin-side-container");
// Error box for signin side
const error_box_for_signin = document.getElementById("error-box-for-signin");
// Loader inside login to account button
const loader_inside_login_btn = document.getElementById("loader-inside-login-btn");
// Error box for login to display the errors related to login
let error_box_for_login = document.getElementById("error-box-for-login");
// A button in login form by clicking it you can go to signin form
let go_to_Signin_form_btn = document.getElementById("go-to-signin-form");
// This is a form nedded an email, to send reset password mail
let reset_password_email_page = document.querySelector(".send-reset-email-side");
// Forgot password button (it is a span)
const forgot_password_btn = document.querySelector(".forgot-password");
// This is a form nedded an email, to send reset password mail
const reset_password_email_form = document.getElementById("send-reset-email-form");
// Loader container insidereset-passwors-email submit button
const loader_inside_send_reset_password_mail_btn = document.getElementById("loader-inside-send-reset-password-email-btn");
// Error or message box for send-reset-password-mail
let error_box_for_reset_password_mail = document.getElementById("error-box-for-reset-password-mail");
//=============================================//



//---------------------------------------------//
//           HANDLING SIGN IN SIDE             //
//---------------------------------------------//
/*
 > Here value will be set that, which form is currently displaying.
 > This will help to hide and show forms when user clicks on back button.
 > This will help in managing window.history()
*/
let currentDisplayingForm = 'Sign in form';

// This event listener will help to0 controll browser back button
window.addEventListener('popstate', handleBackButton);


// If you submit signin form then...
sign_in_form.addEventListener("submit", async (e)=>{
	e.preventDefault();
	// Unhide the loader inside that register account button
	loader_inside_register_btn.style.display = "flex";
	
	// Getting all data of form fields 
	let username = document.getElementById("sign-in-name").value;
	let fullname = document.getElementById("sign-in-fullname").value;
	let email = document.getElementById("sign-in-email").value;
	let password = document.getElementById("sign-in-password").value;
	let confirm_password = document.getElementById("sign-in-password-confirmation").value;
	
	// Making post request to register api
	const options = {
  		method: "POST",
  		body: JSON.stringify({
  			"username":  username,
  			"fullname": fullname,
  			"email": email,
  			"password": password,
  			"password_confirmation": confirm_password
  		}),
  		headers: {
  			'Content-type': 'application/json'
  		}
	};
	let data = await fetch("/api/user/register", options);
	let responce = await data.json();
	
	
	// If status of responce is success then redirect to home page
	if(responce.status ==  "success"){
	  // Hiding the loader inside register button
		loader_inside_register_btn.style.display = "none";
		// Displaying that success message inside it's error box
		error_box_for_signin.innerText = responce.message;
		// Changing color of error box to green, because we have  to display success message
		error_box_for_signin.classList.add("green");
		// Empty the form fields
  	document.getElementById("sign-in-name").value = "";
  	document.getElementById("sign-in-fullname").value = "";
  	document.getElementById("sign-in-email").value = "";
  	document.getElementById("sign-in-password").value = "";
  	document.getElementById("sign-in-password-confirmation").value = "";
		// After 5 seconds the message will automatically hidden
		setTimeout(()=>{
		  error_box_for_signin.innerText = "";
		  error_box_for_signin.classList.remove("green");
		}, 5000);
	}
	/* 
	 > Else, if status of responce is not success then..
	 > It means responce is sending some error message.
	 > So display that error and etc.
	*/
	else{
	  // Displaying that error message inside it's error box
		error_box_for_signin.innerText = responce.message;
		// Hide the loader inside register account button
		loader_inside_register_btn.style.display = "none"
		
		// After 5 seconds that error message will automatically hidden
		setTimeout(()=>{
			error_box_for_signin.innerText = "";
		}, 5000);
	} 
});



// If you click on login to account button then loging form will display
go_to_login_btn.addEventListener("click", ()=>{
  // Pushing a page history to window object
	window.history.pushState({id: 1}, null, "?q=1234&u=loginForm");
	// Hiding signin side or form
	signInPage.style.display = "none";
	// Unhiding login side or form
	loginPage.style.display = "block"
	// Here we are telling that now login form is displaying
	currentDisplayingForm = "Login form"
});
//=============================================//




//---------------------------------------------//
//             HANDLING LOGIN SIDE             //
//---------------------------------------------//
// If you submit login form
login_form.addEventListener("submit", async (e)=>{
	e.preventDefault();
	// Unhiding the loader inside login button
	loader_inside_login_btn.style.display = "flex";

	// Getting all data of form fields 
	let email = document.getElementById("login-email").value;
	let password = document.getElementById("login-password").value;
	
	// Making post request to login api
	const options = {
  		method: "POST",
  		body: JSON.stringify({
  			"email": email,
  			"password": password,
  		}),
  		headers: {
  			'Content-type': 'application/json'
  		}
	};
	let data = await fetch("/api/user/login", options);
	let responce = await data.json();
  
  
  // If status of responce is success then redirect to home page
  if(responce.status ==  "success"){
    
		loader_inside_login_btn.style.display = "none"
		location.href = "/profile"
	}
	/* 
	 > Else, if status of responce is not success then..
	 > It means responce is sending some error message.
	 > So display that error and etc.
	*/
	else{
	  // Displaying that error message inside it's error box
		error_box_for_login.innerText = responce.message;
		// Hiding the loader inside login button
		loader_inside_login_btn.style.display = "none";
		
		// After 5 seconds that error message will automatically hidden
		setTimeout(()=>{
			error_box_for_login.innerText = "";
		}, 5000);
		
		if(responce.message == "Your email is not verified"){
		  let user_id_in_db = responce.userid
		  location.href = `/api/user/email-not-verified/${user_id_in_db}`;
		}
	}
});
  


// If you click on register account button then signin form will display
go_to_Signin_form_btn.addEventListener("click", ()=>{
  // Pushing a page history to window object
	window.history.pushState({id: 1}, null, "?q=1234&u=loginForm");
	// Hiding the login form
	loginPage.style.display = "none"
	// Unhiding the signin form
	signInPage.style.display = "block";
	// We are telli8ng that, now signin form is displaying
	currentDisplayingForm = "Sign in form";
	// Take the window history one step back
	window.history.back();
});
//=============================================//




//---------------------------------------------//
//       HANDLING FORGOT PASSWORD SIDE         //
//---------------------------------------------//
// If you click on forgot password btn then display send-forgot-password-email form
forgot_password_btn.addEventListener("click", ()=>{
  // Pushing a page history to window object
	window.history.pushState({id: 1}, null, "?q=1234&u=resetPasswordForm");
	// Hiding signin side or form
	loginPage.style.display = "none";
	// Unhiding login side or form
	reset_password_email_page.style.display = "flex"
	// Here we are telling that now login form is displaying
	currentDisplayingForm = "Send reset password email form"
});



reset_password_email_form.addEventListener("submit", async (e) =>{
  e.preventDefault();
	// Unhiding the loader inside login button
	loader_inside_send_reset_password_mail_btn.style.display = "flex";

	// Getting all data of form fields 
	let email = document.getElementById("email-to-send-reset-password-mail").value;

	// Making post request to login api
	const options = {
  		method: "POST",
  		body: JSON.stringify({
  			"email": email,
  		}),
  		headers: {
  			'Content-type': 'application/json'
  		}
	};
	// Emptieng the email field
	document.getElementById("email-to-send-reset-password-mail").value = "";
	let data = await fetch("/api/user/send-reset-password-email", options);
	let responce = await data.json();
  
  // If status of responce is success then redirect to home page
  if(responce.status ==  "success"){
		loader_inside_send_reset_password_mail_btn.style.display = "none";
		// Displaying that success message inside it's error box
		error_box_for_reset_password_mail.innerText = responce.message;
		error_box_for_reset_password_mail.classList.add("green");
		setTimeout(()=>{
		  error_box_for_reset_password_mail.innerText = "";
		  error_box_for_reset_password_mail.classList.remove("green");
		}, 5000)
	}
	/* 
	 > Else, if status of responce is not success then..
	 > It means responce is sending some error message.
	 > So display that error and etc.
	*/
	else{
	  // Removing classList greeen bacause now we need to display error message
	  error_box_for_reset_password_mail.classList.remove("green");
	  // Displaying that error message inside it's error box
		error_box_for_reset_password_mail.innerText = responce.message;
		// Hiding the loader inside login button
		loader_inside_send_reset_password_mail_btn.style.display = "none";
		
		// After 5 seconds that error message will automatically hidden
		setTimeout(()=>{
			error_box_for_reset_password_mail.innerText = "";
		}, 5000);
	}
});
//=============================================//




//---------------------------------------------//
//        HANDLING SOME OTHER THINGS           //
//---------------------------------------------//
/* 
 > This function will handle browser back botton
 > This will help to display different forms without page reload
*/
function handleBackButton(){
    /*
      > When user will click on back button, and login form is displaying then =>
      > Hide the login form and display the sign in form
    */
  	if(currentDisplayingForm == "Login form"){
  	  // Hiding the login form
  		loginPage.style.display = "none";
  		// Unhide the signin form
  		signInPage.style.display = 'block';
  		// We are telling that, now sign in form is displaying
  		currentDisplayingForm = "Sign in form";
  	}
  	
  	/*
      > When user will click on back button, and send-reset-password-email form is displaying then =>
      > Hide the send-reset-password-email form and display the login form
    */
  	if(currentDisplayingForm == "Send reset password email form"){
  	  // Hiding the send-reset-password-email form
  		reset_password_email_page.style.display = "none";
  		// Unhide the login form
  		loginPage.style.display = 'block';
  		// We are telling that, now login form is displaying
  		currentDisplayingForm = "Login form";
  	}
};
//=============================================//




// Login with google side
function select(name){
  let element = document.querySelector(`${name}`)
  return(element)
};
function selectAll(name){
  let element = document.querySelectorAll(`${name}`)
  return(element)
};



const google_btn = select("#register-with-google-button");

google_btn.addEventListener("click", getGoogleOAuthURL);




async function getGoogleOAuthURL(){
 const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
 
	
 
 
 
 
 const options = {
   redirect_uri: redirect_uri,
   client_id: client_id,
   access_type: 'offline',
   response_type: 'code',
   prompt: 'consent',
   scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
   ].join(" ")
 };
 
 console.log(`Options: ${ JSON.stringify(options, null, 2) }`);
 // console.log(`Options: ${options}`);
 
 const qs = new URLSearchParams(options);
 
 console.log(`qs: ${qs}`);
 console.log("`${rootUrl}?${qs.toString()}`: " + `${rootUrl}?${qs.toString()}`)
 
 
 return location.href = `${rootUrl}?${qs.toString()}`;
  
};


const login_with_google_btn = select("#login-with-google-button");

login_with_google_btn.addEventListener("click", async () => {
   const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
 
  
 
 
  console.log(`login_redirect_uri ${login_redirect_uri}`) 
 
 const options = {
   redirect_uri: login_redirect_uri,
   client_id: client_id,
   access_type: 'offline',
   response_type: 'code',
   prompt: 'consent',
   scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
   ].join(" ")
 };
 
 console.log(`Options: ${ JSON.stringify(options, null, 2) }`);
 // console.log(`Options: ${options}`);
 
 const qs = new URLSearchParams(options);
 
 console.log(`qs: ${qs}`);
 
 return location.href = `${rootUrl}?${qs.toString()}`;
  
});