const reset_password_form = document.getElementById("reset-password-form");
const loader_inside_reset_password_btn = document.getElementById("loader-inside-reset-password");
const error_box_for_reset_password = document.getElementById("error-box-for-reset-password");




reset_password_form.addEventListener("submit", async (e) =>{
  e.preventDefault();
	// Unhiding the loader inside login button
	loader_inside_reset_password_btn.style.display = "flex";

	// Getting all data of form fields 
	let new_password = document.getElementById("new-password").value;
	let confirm_password = document.getElementById("confirm-password").value;
	
	// Making post request to login api
	const options = {
  		method: "POST",
  		body: JSON.stringify({
  			"password": new_password,
  			"password_confirmation": confirm_password
  		}),
  		headers: {
  			'Content-type': 'application/json'
  		}
	};
	// Emptieng the email field
	document.getElementById("new-password").value = "";
	document.getElementById("confirm-password").value = "";
	
	const id = reset_password_form.dataset.userid;
	const token = reset_password_form.dataset.token;
	let data = await fetch(`/api/user/reset-password/${id}/${token}`, options);
	let responce = await data.json();
  
  // If status of responce is success then redirect to home page
  if(responce.status ==  "Success"){
		loader_inside_reset_password_btn.style.display = "none";
		// Displaying that success message inside it's error box
		error_box_for_reset_password.innerText = responce.message;
		error_box_for_reset_password.classList.add("green");
		setTimeout(()=>{
		  error_box_for_reset_password.innerText = "";
		  error_box_for_reset_password.classList.remove("green");
		}, 5000)
	}
	/* 
	 > Else, if status of responce is not success then..
	 > It means responce is sending some error message.
	 > So display that error and etc.
	*/
	else{
	  // Removing classList greeen bacause now we need to display error message
	  error_box_for_reset_password.classList.remove("green");
	  // Displaying that error message inside it's error box
		error_box_for_reset_password.innerText = responce.message;
		// Hiding the loader inside login button
		loader_inside_reset_password_btn.style.display = "none";
		
		// After 5 seconds that error message will automatically hidden
		setTimeout(()=>{
			error_box_for_reset_password.innerText = "";
		}, 5000);
	}
});
//=============================================//