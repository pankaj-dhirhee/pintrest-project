// Main container of page
let mainContainerOfPage = document.querySelector(".main-container-of-page");
// Close button of upload image cart
let closeButton = document.querySelector(".close");
// Upload section 
let uploadSection = document.querySelector(".upload-sec");
// Upload image button
let UploadImageBtn = document.getElementById("upload-image");
// Upload image form
let uploadForm = document.querySelector(".uplod-image-form")
// Submit button of upload image form
let submitBtn = document.getElementById("upload-submit");
// Loader container
let loaderContainer = document.querySelector(".loader-container");
// Form or upload image
let form = document.querySelector(".uplod-image-form");
// Loader container inside upload image submit btn
let LoaderInsideUploadImageSubmitBtn = document.querySelector(".loader-container-inside-upload-image-submit-btn");
// Post image option 
let postsOption = document.getElementById("posts-option");
// Saved iamge optioon
let savedOption = document.getElementById("saved-option");
// Hidden form form uploading profile image
let uploadProfileImageForm = document.querySelector(".form-profile-image");
// Pen icon inside profile image to upload profile image
let profilePictt = document.querySelector("#up-pen");
// Input type file inside hidden form
let inputForProfileImage = document.querySelector(".form-profile-image input");
// Close button inside delete button
let closeBtnInDeleteBtn = document.querySelector(".close-delete-btn");
// Delete button inside dropdown menu
let delete_button = document.querySelector(".delete-btn");
// Dropdown menu that will be shown onclick of three dotd inside image box
let dropdown_menu_for_image_box = document.querySelector(".dropdown-menu-for-image-box");
// This will cover the whole screen when dropdown menu will be shown to prevent action if anchor tag and by clicking it user can hide dropdown menu
let page_cover = document.querySelector(".cover-outside-the-dropdown");
// Loader inside delete button container5
let loader_of_delete_btn = document.getElementById("loader-of-delete-btn");
// Image tag of profile image 
let profileImageTag = document.getElementById("profile-image-tag");
// Images container
let imagesContainer = document.querySelector(".image-container");
//=============================================//



//---------------------------------------------//
//         UPLOADING IMAGE SECTION             //
//---------------------------------------------//
// Show upload cart on click of upload image button
UploadImageBtn.addEventListener("click", ()=>{
  uploadSection.style.display = 'flex';
  mainContainerOfPage.style.opacity = '0.1';
});

// Hide upload cart on click of close button inside upload card
closeButton.addEventListener("click", ()=>{
  uploadSection.style.display = 'none';
  mainContainerOfPage.style.opacity = '1';
});


// When you submit the upoad image form
uploadForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  
  // Getting File inside file input
  const userFile = document.getElementById("file-inp-inside-upload-form").files[0];
  // Getting image text 
  const imageText = document.getElementById("image-text").value;
  // Getting the description of image
  const imageDescription = document.getElementById("image-description").value;
  
  // If iamgeText and imageDescription is not emopty then only do these...
  if(imageText != "" && imageDescription != ""){
	  submitBtn.style.display = 'none';
	  LoaderInsideUploadImageSubmitBtn.style.display = "flex";
            
	  // Making new form data
	  const formData = new FormData();
	  // Pushing the given file to form data as name = file
	  formData.append('file', userFile);
	  // Pushing the given image text to form data as name = filecaption
	  formData.append('filecaption', imageText);
	  // Pushing the given description to form data as name = description
	  formData.append('description', imageDescription);
	  
	  	  // Sending Form data in post request
	  const data = await fetch('/upload/Your uploads', {
	  	method: "POST",
	    body: formData,
	  });
	  const responce = await data.json();
	         
	  // Getting Image counter inside yourUploads image box or first imageCounter
	  let imageCounterInsideIt = document.querySelector(`[data-counterspan~='your-uploads']`);
	  /*
	   > If user has not uploaded any post then incrementing imageCounterInsideIt, will give error.
	   > if error accured then it means that there is no image-box which of data-counterspan = your-uploads.
	   > In this case we need to make image box for Your uploads board and display there uploaded file
	  */
	  try{
	    // Increment its value by 1
	    imageCounterInsideIt.innerHTML = parseInt(imageCounterInsideIt.innerHTML) + 1;
	  }catch(err){
	  	// Detting userid from our custom attribute
	  	let userId = profileImageTag.dataset.userid;
	  	// Getting name of new uploaded file friom responce
	  	let newUploadedFile = responce.newUploadedFile;
	  	let number_of_image_box = document.querySelectorAll(".image-box").length;
	  	
	  	imagesContainer.innerHTML += `
	  	  <div class="box image-box" data-imageboxindex="${number_of_image_box}">
		       <a href="/show/Your uploads">
		           <img src="/images/uploads/${newUploadedFile}"/>
		       </a>
		       <div class="caption">
			       	<div class="left">
					       	<p> Your uploads </p>
						       <span> 
						       		<span class="image-counter-inside-image-boxes" data-counterspan="your-uploads"> 
						       		    1  
						       		</span> 
						       		Images 
						       </span>
				       	</div>
				       	<div class="right dot" data-userid="${userId}" data-boardname="Your uploads" data-indexofdotbtn="${number_of_image_box}">
	        	      <img src="/images/three-dots.png" class="dot three-dot-image" data-boardname="Your uploads" data-userid="${userId}" data-indexofthreedotimage="${number_of_image_box}"/>
	              </div>
		       </div>
	      </div> 	 
	  	`;
	  	imageCounterInsideIt = document.querySelector(`[data-counterspan~='Your uploads']`);
	  	// This function will add event listener to three button inside all image box
	  	show_dropdown_menu_onclick_of_three_dots_of_image_box();
	  }
	  
	  
	  // If responce.status =  ok then...
	  if(responce.status == "ok"){
	  	// Hide the loader inside submit button
	    LoaderInsideUploadImageSubmitBtn.style.display = "none";
	    // Unhide the submit button
	    submitBtn.style.display = 'block';	
	  }
	  
	  // Click the close button so that upload-image-form will be hidden
	  closeButton.click();
  }// If condition
});
//=============================================//



//---------------------------------------------//
//              OPTIOMS  SECTION               //
//---------------------------------------------//
// Posted image button
postsOption.addEventListener("click", (btn)=>{
	savedOption.style.background = '#686868';
	postsOption.style.background = '#9e0020';
});

// Saved images button
savedOption.addEventListener("click", (btn)=>{
	postsOption.style.background = '#686868';
	savedOption.style.background = '#9e0020';
});
//=============================================//



//---------------------------------------------//
//        UPLOAD PROFILE IMAGE SECTION         //
//---------------------------------------------//
/* When you click on pencil icon then =>
   1. Input type file inside hidden form  will be clicked
*/
profilePictt.addEventListener("click", ()=>{
	inputForProfileImage.click();
});


// If input will change then...
inputForProfileImage.addEventListener("change", async ()=>{
	// This is previous profile image
  let previousProfileImage = profileImageTag.dataset.profileimage;
	// Getting the given image from file input of profile image form,
	let givenProfileImage = inputForProfileImage.files[0];
	
	// Making new form data
	const formData = new FormData();
	// Pushing the given file [image] to form data as name = file
	formData.append('image', givenProfileImage);
	  
	// Sending Form data in post request
	const data = await fetch(`/fileupload/${previousProfileImage}`, {
	  method: "POST",
	  body: formData,
	});
	const responce = await data.json();
	
	// If responce.status = ok then...
	if(responce.status == 'ok'){
		// Getting nem of new profile image from responce.newProfileImage
		let nameOfNewProfileImage = responce.newProfileImage;
		// Setting src of profile image to new profile image 
	  profileImageTag.src = `/images/uploads/${nameOfNewProfileImage}`;
	  // Updating value of data-profileimage to new profile image
	  profileImageTag.dataset.profileimage = nameOfNewProfileImage;
	}
})
//=============================================//



//---------------------------------------------//
// SHOWING DROPDOWN MENU ONCLICK OF THREEE DOT //
//---------------------------------------------//
/* When user click on three dots indide image boxes then =>
   1. Dropdown menu will be displayed
*/
function show_dropdown_menu_onclick_of_three_dots_of_image_box(){
  /* caption inside image box. It ontains =>
     left and right side.
     In left side there is image title or image text.
     In right side there is image of three dots
  */ 
	let caption = document.querySelectorAll(".caption");
	// Getting all elements inside image box that contains class 'dot'
	let dot = document.querySelectorAll(".dot");
	// Getting dropdown menu
  let dropdown_menu_for_image_box = document.querySelector(".dropdown-menu-for-image-box");
  
  caption.forEach((image)=>{ 
    image.addEventListener("click", (e)=>{
   	   // Checking elment if it contains class 'dot'
  	   let classContain = e.target.classList.contains("dot");
  	   // Getting boardNqme from our custom attribute
  	   let boardName = e.target.dataset.boardname;
  	   // Getting userId from our custom attribute
  	   let userId = e.target.dataset.userid;
  	 	 // If clicked element contains class 'dot', then perform delete functionality
  	 	 if(classContain){
          /* Setting a url in custom attribute to delete button,
  	         This url will be used to delete the correct board.
  	      */	 	   
  		 		delete_button.dataset.deleteinfo=`/api/deleteboard/${userId}/${boardName}`;
  		 		/* Setting index of clicked element to delete button.
  		 		   This index will help to remove the correct image box, from image boxes container.
  		 		*/
  		 		delete_button.dataset.clickeddotindex = e.target.dataset.indexofdotbtn;
  			  // Getting index of clicked element or three dot from its custom attribute
  			  let index_of_clicked_dot = e.target.dataset.indexofdotbtn;
  			  // Getting clicked three dot image tag
  			  let clicked_image_three_dot = document.querySelector(`[data-indexofthreedotimage="${index_of_clicked_dot}"]`);
  			  // Getting boundingClient of clicked three dot image tag to show dropdown menu in correct position
  		    let bounting_client_of_clicked_three_dot = clicked_image_three_dot.getBoundingClientRect();
  		    // Now show the dropdown menu
  			  dropdown_menu_for_image_box.style.display = "inline-block"
  			  // Unhiding the page cover. this will avoid anchor click and by clicking it dropdown will be hidden
  			  page_cover.style.display = "block";
  			  // Getting value of left position of three dot image tag
  			  let left = bounting_client_of_clicked_three_dot.left
  			  // Getting value of top position of three dot image tag
  			  let top = bounting_client_of_clicked_three_dot.top
  			  /* Getting value of  right side position of three dot image tag
  			     Actually in case of getting value of right side, boundingClient give the sum of 'left value' and 'width of given element'
  			     So to get actial value of right side we do => 'window.innerWidth - bounting_client_of_clicked_three_dot.right'
  			  */
  			  let right = window.innerWidth - bounting_client_of_clicked_three_dot.right;
  			  
  			  /* If value of right side is less than 100px, means there is no space in right side to display the dropdown menu.
  			     Then dispaly the dropdown menu in left side of three dots
  			  */
  			  // Here, displaying dropdown menu in left side of three dot.
  			  if(right < 100){
  			    /* Setting value of left position to auto because =>
  			       If value of left side would already set by else condition and,
  			       We will here set value of right position, then dropdown menu will be stretched.
  			    */
  			    dropdown_menu_for_image_box.style.left = "auto";
  			    // Setting right position of dropdown menu
  			    dropdown_menu_for_image_box.style.right = right +  "px";
  			    // Setting top position of dropdown menu
  			    dropdown_menu_for_image_box.style.top = top +  "px";
  			  }
  			  // Here, displaying dropdown menu in right side of three dot.
  			  else{
  			    // Setting value of right position to auto to avoid stretching od dropdown menu
  			    dropdown_menu_for_image_box.style.right = "auto";
  			    dropdown_menu_for_image_box.style.left = left +  "px";
  			    dropdown_menu_for_image_box.style.top = top +  "px";
  			  }
  			  // This finction will hide the dropdown menu & page cover & etc...
  			  function hide_page_cover_and_dropdown(){
  			    dropdown_menu_for_image_box.style.display = "none";
  	 	      page_cover.style.display = "none";
  			    page_cover.removeEventListener("click", hide_page_cover_and_dropdown);
  			    page_cover.removeEventListener("scroll", hide_page_cover_and_dropdown);
  			  }
  			  page_cover.addEventListener("click", hide_page_cover_and_dropdown);
          page_cover.addEventListener("scroll", hide_page_cover_and_dropdown);
   	   }
    });
  });
}; // show_dropdown_menu_onclick_of_three_dots_of_image_box()
show_dropdown_menu_onclick_of_three_dots_of_image_box()
//=============================================//



//---------------------------------------------//
//   HANDLING DELETE BUTTON OF DROPDOWN MENU   //
//---------------------------------------------//
function delete_button_event_listener(){
  // By clicking delete button you can delete a board
  delete_button.addEventListener("click", async ()=>{
    /* When text inside delete button would hide to dispaly the loader then =>
       width of delete button will be decreased.
       These code make sure that its will will be same when hiding text &  displaying loadder.
    */
    let bounding_client_delete_button = delete_button.getBoundingClientRect();
    delete_button.style.height = bounding_client_delete_button.height + "px";
    delete_button.style.width = bounding_client_delete_button.width + "px";
    delete_button.querySelector(".btn-text").style.display = "none";
    loader_of_delete_btn.style.display = "flex"
    
    // This api url had set when you clicked three dots
    let api_urt = delete_button.dataset.deleteinfo;
    let get_request = await fetch(api_urt);
    let responce = await get_request.json();
    
    // If responce status id success, then the board is deleated succesfully
    if(responce.status == "success"){
      // this block of code is removing the deleated board from the image container
      let index_of_clicked_dot = delete_button.dataset.clickeddotindex;
      let element_to_be_removed = document.querySelector(`[data-imageboxindex~="${index_of_clicked_dot}"]`);
      element_to_be_removed.remove();
      
      // Now unhide the text inside delete button
      delete_button.querySelector(".btn-text").style.display = "inline";
      // Hide the loader of delete button
      loader_of_delete_btn.style.display = "none";
      // Hide the dropdown menu
      dropdown_menu_for_image_box.style.display = "none";
      // This is a div element that covers whole page when three dot is clicke to avoid click of anchor tags
      page_cover.style.display = "none";
    };
  });
}; // function delete_button_event_listener()
delete_button_event_listener()
//=============================================//