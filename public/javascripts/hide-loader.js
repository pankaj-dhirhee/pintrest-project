// Loader container
let loaderOfPage = document.querySelector(".loader-of-page");
// Main containet of page
let MainContainerOfWholePage = document.querySelector(".main-container-of-page");


// When all the content loaded then hide the loader & unhide the main container of page
window.addEventListener("load", ()=>{
	setTimeout(()=>{
	  // Hide the loader
	  loaderOfPage.style.display = "none";
	  // Unhide the main container of page 
	  MainContainerOfWholePage.style.display = "block";	
  }, 900)
});
