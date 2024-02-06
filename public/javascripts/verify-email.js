// Button for verifying email
const verify_email_button = document.getElementById("verify-email-btn");
// This is a small loader inside verify-emai button
const loader_inside_verify_email_btn = document.getElementById("loader-inside-verify-email-btn");
// Error box for displaying errors as well as success messages
const error_box_for_verify_email = document.getElementById("error-box-for-verify-mail");
// When email will be verified then we will append a button that will redirect to the profile page
const container_for_go_to_profile_page_btn = document.getElementById("container-for-redirecting-to-site");



//---------------------------------------------//
//     HANDLING VERIFY EMAIL FUNCTIONALITY     //
//---------------------------------------------//
// When you click on verify-email button 
verify_email_button.addEventListener("click", async (e) =>{
  e.preventDefault();
	// Unhiding the loader inside verify-email button
	loader_inside_verify_email_btn.style.display = "flex";

	// Getting verify email token from dataset of verify-email button
	let info = verify_email_button.dataset.info;
  
	// Making post request verify-email api
	const options = {
  		method: "POST",
  		body: JSON.stringify({
  			"verify_email_token": info,
  		}),
  		headers: {
  			'Content-type': 'application/json'
  		}
	};
	let data = await fetch(`/api/user/verifyemail`, options);
	let responce = await data.json();
  
  // If status of responce is success then...
  if(responce.status ==  "success"){
    // Hide the loader inside verify email button
		loader_inside_verify_email_btn.style.display = "none";
		// Displaying that success message inside in it's error box
		error_box_for_verify_email.innerText = responce.message;
		// Changing color of error box to green, because we have  to display success message
		error_box_for_verify_email.classList.add("green");
		
		// Appending a button so that by clicking it user can be redirected to the profile page
		container_for_go_to_profile_page_btn.innerHTML = `
		  <a href="/profile" class="redirect-to-profile-page-anchor">
		    Go to profile page
		  </a>
		`;
		
		// After 5 seconds the message will automatically hidden
		setTimeout(()=>{
		  error_box_for_verify_email.innerText = "";
		  error_box_for_verify_email.classList.remove("green");
		}, 5000)
	}
	/* 
	 > Else, if status of responce is not success then..
	 > It means responce is sending some error message.
	 > So display that error and etc.
	*/
	else{
	  // Removing classList greeen bacause now we need to display error message
	  error_box_for_verify_email.classList.remove("green");
	  // Displaying that error message inside it's error box
		error_box_for_verify_email.innerText = responce.message;
		// Hiding the loader inside login button
		loader_inside_verify_email_btn.style.display = "none";
		
		// After 5 seconds that error message will automatically hidden
		setTimeout(()=>{
			error_box_for_verify_email.innerText = "";
		}, 5000);
	}
});
//=============================================//