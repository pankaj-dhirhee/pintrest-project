// Button to send-verify-email-link
const send_verify_mail_btn = document.getElementById("send-verify-email-btn");
// Loader inside verify-email button
const loader_inside_send_verify_email_btn = document.getElementById("loader-inside-send-verify-email-btn");
// Error box for displaying error as well as success message
const error_box_for_send_verify_email = document.getElementById("error-box-for-send-verify-mail");



//---------------------------------------------//
//      HANDLING  EMAIL NOT VERIFIED SIDE      //
//---------------------------------------------//
// When you click on send-verify-email-link button
send_verify_mail_btn.addEventListener("click", async (e) =>{
  e.preventDefault();
	// Unhiding the loader inside send-verify-email-link button
	loader_inside_send_verify_email_btn.style.display = "flex";

	// Getting user id from dataset of send-verify-email-link button
	let user_id_in_db = send_verify_mail_btn.dataset.userid;

	// Making post request to send-verify-email-link api
	const options = {
  		method: "POST",
  		body: JSON.stringify({
  			"userid": user_id_in_db
  		}),
  		headers: {
  			'Content-type': 'application/json'
  		}
	};
	let data = await fetch(`/api/user/send-email-verification-link`, options);
	let responce = await data.json();
  
  // If status of responce is success then redirect to home page
  if(responce.status ==  "success"){
		loader_inside_send_verify_email_btn.style.display = "none";
		// Displaying that success message inside it's error box
		error_box_for_send_verify_email.innerText = responce.message;
		// Changing color of error box to green, because we have  to display success message
		error_box_for_send_verify_email.classList.add("green");
		
		// After 5 seconds the message will automatically hidden
		setTimeout(()=>{
		  error_box_for_send_verify_email.innerText = "";
		  error_box_for_send_verify_email.classList.remove("green");
		}, 5000);
	}
	/* 
	 > Else, if status of responce is not success then..
	 > It means responce is sending some error message.
	 > So display that error and etc.
	*/
	else{
	  // Removing classList greeen bacause now we need to display error message
	  error_box_for_send_verify_email.classList.remove("green");
	  // Displaying that error message inside it's error box
		error_box_for_send_verify_email.innerText = responce.message;
		// Hiding the loader inside send-verify-email-link button
		loader_inside_send_verify_email_btn.style.display = "none";
		
		// After 5 seconds that error message will automatically hidden
		setTimeout(()=>{
			error_box_for_send_verify_email.innerText = "";
		}, 5000);
	}
});
//=============================================//