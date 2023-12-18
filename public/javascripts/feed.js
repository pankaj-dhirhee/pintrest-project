// caption inside image box
let caption = document.querySelectorAll(".caption");
// Close button inside delete button
let closeBtnInDeleteBtn = document.querySelector(".close-delete-btn")
// Anchor tag inside delete button
let anchorInsideDeleteBtn = document.querySelector(".anchor-inside-delete-btn");
// Main container of delete button
let delBox = document.querySelector('.delete-main-con');
// This is direct child of main container of delete button 
delBtn = document.querySelector('.delete-btn')
// Selecting three dots of all image box 
let dot = document.querySelectorAll(".dot");



//---------------------------------------------//
//   HANDLING DELETE BUTTON AND FUNCTIONALITY  //
//---------------------------------------------//
/* When user click on three dots then =>
   1. Give id of three dotd to href of anchor.
   2. This will help to delete the desired image.
*/

caption.forEach((image)=>{ 
 image.addEventListener("click", (e)=>{
 	   // Checking elment if it contains class 'dot'
	   let classContain = e.target.classList.contains("dot");
	 	 // If clicked element contains class 'dot', then perform delete functionality
	 	 if(classContain){
		 		anchorInsideDeleteBtn.href=`deleteimage/${e.target.id}`;
			  //show the delete box
			  delBox.style.display = "flex" 
			  //giving bottom position to con of delBtn
			  delBox.style.bottom = "1%";
 	   }
 });
});


// Closing delete button
closeBtnInDeleteBtn.addEventListener('click', (e)=>{
	delBox.style.display = 'none';
});
//=============================================//