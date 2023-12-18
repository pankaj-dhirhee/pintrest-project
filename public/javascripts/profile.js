// Main container of page
let mainContainerOfPage = document.querySelector(".main-container-of-page");
// Close button of upload image cart
let closeButton = document.querySelector(".close");
// Upload section 
let uploadSection = document.querySelector(".upload-sec");
// Upload image button
let UploadImageBtn = document.querySelector("#upload-image");
// Upload image form
let uploadForm = document.querySelector(".uplod-image-form")
// Submit button of upload image form
let submitBtn = document.getElementById("upload-submit");
// Loader container
let loaderContainer = document.querySelector(".loader-container");
// Form or upload image
let form = document.querySelector(".uplod-image-form");
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

// Show loader in place of submit button when fdrm is submitted
uploadForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  submitBtn.style.display = 'none';
  loaderContainer.style.display = "flex";
  form.submit();
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

// If input will change [You selected any file] then form will be submitted
inputForProfileImage.addEventListener("change", ()=>{
	uploadProfileImageForm.submit();
})
//=============================================//