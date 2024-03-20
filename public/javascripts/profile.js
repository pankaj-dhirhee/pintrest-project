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
let LoaderInsideUploadImageSubmitBtn = document.querySelector(".loader-container-inside-upload-image-submit-btn")
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
// caption inside image box
let caption = document.querySelectorAll(".caption");
// Close button inside delete button
let closeBtnInDeleteBtn = document.querySelector(".close-delete-btn")
// A container inside delete button that contains text and a delete icon
let delete_button = document.querySelector(".delete-btn")


let dropdown_menu_for_image_box = document.querySelector(".dropdown-menu-for-image-box");

// This is direct child of main container of delete button 
delBtn = document.querySelector('.delete-btn')
// Loader inside delete button container5
let loader_of_delete_btn = document.getElementById("loader-of-delete-btn")
// Selecting three dots of all image box 
let dot = document.querySelectorAll(".dot");
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
  console.log("Upload image event listener")
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
	  	
	  	imagesContainer.innerHTML += `
	  	  <div class="box image-box">
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
				       	<div class="right dot" data-userid="${userId}" data-boardname="Your uploads">
	        	      <img src="/images/three-dots.png" class="dot" data-boardname="Your uploads" data-userid="${userId}"/>
	              </div>
		       </div>
	      </div> 	 
	  	`;
	  	imageCounterInsideIt = document.querySelector(`[data-counterspan~='Your uploads']`);
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
//         DELETE BOARD FUNCTIONALITY          //
//---------------------------------------------//
/* When user click on three dots then =>
   1. It will delete the board  and all posts inside it.
*/

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
	 	   
        	 	   
		 		delete_button.dataset.deleteinfo=`/api/deleteboard/${userId}/${boardName}`;
		 		delete_button.dataset.clickeddotindex = e.target.dataset.indexofdotbtn;
			  //show the delete box
			  let index_of_clicked_dot = e.target.dataset.indexofdotbtn;
			  console.log("index_of_clicked_dot " + index_of_clicked_dot);
			  let clicked_image_three_dot = document.querySelectorAll(".three-dot-image")[index_of_clicked_dot];
			  console.log("clicked_image_three_dot " + JSON.stringify(clicked_image_three_dot));
			  
		  let bounting_client_of_clicked_three_dot = clicked_image_three_dot.getBoundingClientRect();
			  dropdown_menu_for_image_box.style.display = "inline-block"
			  //clicked_image_three_dot.style.border = "2px solid red"
			 console.log(bounting_client_of_clicked_three_dot)
			  let left = bounting_client_of_clicked_three_dot.left
			  let top = bounting_client_of_clicked_three_dot.top
			  let right = window.innerWidth - bounting_client_of_clicked_three_dot.right;
			  console.log("right" + right);
			  console.log("left" + left)
			  if(right < 100){
			    
			    console.log("If satatement");
			    dropdown_menu_for_image_box.style.left = "auto";
			    dropdown_menu_for_image_box.style.right = right +  "px";
			    dropdown_menu_for_image_box.style.top = top +  "px";
			    
			  }else{
			    console.log("else statement");
			    dropdown_menu_for_image_box.style.right = "auto";
			    dropdown_menu_for_image_box.style.left = left +  "px";
			    dropdown_menu_for_image_box.style.top = top +  "px";
			    
			  }
			  
			  
			  
			 // Thius function will add event listener to the delete button  
			 delete_button_event_listener();
			 
			 
	 	   mainContainerOfPage.addEventListener("scroll", () =>{
	 	        delete_button.removeEventListener("click", ()=>{ });
	 	      dropdown_menu_for_image_box.style.display = "none";
			  mainContainerOfPage.removeEventListener("scroll", ()=>{ });
	
	       
			  
			  
			  
	 	   });
	 	   
	 	   
	 	   
			  //giving bottom position to con of delBtn
			  //delBox.style.bottom = "1%";
 	   }
 });
});


// Closing delete button
/*closeBtnInDeleteBtn.addEventListener('click', (e)=>{
	delBox.style.display = 'none';
	
});*/





function delete_button_event_listener(){
// When clicking on container inside deelete btn, delete the board
delete_button.addEventListener("click", async ()=>{
  let bounding_client_delete_button = delete_button.getBoundingClientRect();
  delete_button.style.height = bounding_client_delete_button.height + "px";
  delete_button.style.width = bounding_client_delete_button.width + "px";
  
  
  delete_button.querySelector(".btn-text").style.display = "none";
  loader_of_delete_btn.style.display = "flex"
  let api_urt = delete_button.dataset.deleteinfo;
  
  let get_request = await fetch(api_urt);
  let responce = await get_request.json();
  
  if(responce.status == "success"){
    let index_of_clicked_dot = delete_button.dataset.clickeddotindex;
    let element_to_be_removed = document.querySelector(`[data-imageboxindex~="${index_of_clicked_dot}"]`);
    
    element_to_be_removed.remove();
    delete_button.querySelector(".btn-text").style.display = "inline";
    loader_of_delete_btn.style.display = "none";
    dropdown_menu_for_image_box.style.display = "none";
    
  }
});

}  // Delet btn evnt listyener finction end