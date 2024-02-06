{
// Close button inside delete button
let closeBtnInDeleteBtn = document.querySelector(".close-delete-btn")
// Anchor tag inside delete button
let anchorInsideDeleteBtn = document.querySelector(".anchor-inside-delete-btn");
// Main container of delete button
let delBox = document.querySelector('.delete-main-con');
// This is direct child of main container of delete button 
delBtn = document.querySelector('.delete-btn');
// Loader container
let loaderOfPage = document.querySelector(".loader-of-page");
// Main containet of page
let MainContainerOfWholePage = document.querySelector(".main-container-of-page");
// images container 
let imagesContainer = document.querySelector(".image-container");
// Main container of page
let scroller = document.querySelector(".main-container-of-page");
// Selecting body tag from document
let bodyTag = document.querySelector("body");
// Getting boardName from our custom attribute
let boardName = imagesContainer.dataset.boardname;



//---------------------------------------------//
//       SCROLL DOWN TO LOAD MORE CONTENT      //
//---------------------------------------------//
// Windth of screen
let widthOfScreen = window.innerWidth;
// Page number for pagination
let page = 0;
// Limit for items in a page 
let limit = 6;
// Thisw will deside that can we call function hideTheLoader() 
let canWeHideTheLoader = true;

// Setting  different limits on different width if screeen
// 1. Limit for srcreen, width less than and equal to 480px
if(widthOfScreen <= 480){
	limit = 8
}

// 2. Limit for srcreen, width is bigger than 400px & smaller than 787px
if(widthOfScreen > 480 && widthOfScreen < 787){
	limit = 6;
}

// 3. Limit for srcreen, width is bigger than 1000px & smaller than 1201px
if(widthOfScreen > 1000 && widthOfScreen < 1201){
 	limit = 12;
}

// 4. Limit for srcreen, width is bigger than 1200px & smaller than 1428px
if(widthOfScreen > 1200 && widthOfScreen < 1428){
 	limit = 24;
}



/* 
  If it is true then we can fetch image again.
  If we dont do do this then =>
   1. When we scroll little bit then again and again ne wimages will be fetched.
   2. Same images will be desplayed multiple times.
   3. Cannot fetch images properly because of immediately fetching again and again.
*/
let can_we_fetch_and_display_next_image = true;
/* 
  > Here element will come that contains class='col'.
  > class='col' are divs, because of these divs We can see images in columns.
  > Element wiil come in this by a function named getInfo
*/
let columns = undefined;
// Its value will be length of columns variable
let columnsCount = undefined;
// This will deside in which number of column image will append
let currentCol = 0;
// This will deside in which index of column image will append
let index = 0;
// This will help to make masonry layout responsive
let NumberCountForImagesBoxes = 0;
// Index used to make responsive
let indexForResponsive = 0;



// If you scroll then renderImage function will be called
scroller.addEventListener("scroll", (e)=>{
  renderImage();
});



// Function to render image when you reach to end of the page 
async function renderImage(){
	// Value of scroll top of main container of page
	let scrollTop = scroller.scrollTop;
	// Scroll height of main container of page
	let scrollHeight = scroller.scrollHeight;
  // It means when scroller is left 100px to reach to end then start fetching
	let offPageHeight = 100;
	// Difference of scrollHeight and scrollTop
	let difference = scrollHeight - scrollTop;
	// Getting height of main container if page
	let height = scroller.clientHeight;
	
	
	/* 
	  This condition means =>
	  when scroller is left 100px to reach the end then...
	*/
  if(difference < (height + offPageHeight)){
		
		if(can_we_fetch_and_display_next_image == true){
		  // If its value is false then we can't fetch and display images
			can_we_fetch_and_display_next_image = false;
			
			// Increare the value of page by 1 so that we can fetch next images
			page += 1;
			
			// Get requet to the api responsible for displaying images
			// It will return array of post images from post model
			let data = await fetch(`/show/${limit}/${page}/${boardName}`);
			let responce = await data.json();
			
			// Prepare html for each post data
	    for(const elem of responce.data){
	     /*
	       > If columnsCount is undefined then insert html normally.
	       > Because we will araage these in columns by a function named align_in_column
	     */
	     if(columnsCount == undefined){
			     imagesContainer.innerHTML += `
		           	<div class="box images-box" data-index="${indexForResponsive}">
						       <a href="/preview/${elem.image}">
						          <img src="/images/uploads/${elem.image}" />
						       </a>
						       <div class="caption">
						        	 <div class="left">
						       	 	   <span>${elem.imageText}</span>
						       	  </div>
						       	  <div class="right dot" id="${elem.image}" data-boardname="${elem.boardName}">
	        	            <img src="/images/three-dots.png" id="${elem.image}" class="dot" data-boardname="${elem.boardName}"/>
	                    </div>
						       </div>
					      </div> 
			      `;
			      indexForResponsive++;
	       }
	       else{
	       	  /* 
	       	    > Increment the value of currentCol 
	       	    > So the we can inser image to next column
	       	  */
	    	    currentCol += 1;
	    	    /*
	    	      > If currentCol id bigger than columnsCount then value of currentCol = 1.
	    	      > If currentCol id bigger than columnsCount then it means =>
	    	        > We have inserted image in last column, now its time to jump to the next column.
	    	    */
	    	    if(currentCol > columnsCount){
			    		currentCol = 1;
			    	}
	    	    
	          /* 
	            > If value of currentCol is not equals to 0 then its value of index will decrement by 1
	            > Decrement because index number starts from 0
	          */
			    	if(currentCol != 0){
			    		index = currentCol - 1;
			    	}else{
			    		index = 0;
			    	}
	    	
		      	document.querySelectorAll('.col')[index].innerHTML += `
				      <div class="box images-box" data-index="${indexForResponsive}">
						       <a href="/preview/${elem.image}">
						          <img src="/images/uploads/${elem.image}" />
						       </a>
						       <div class="caption">
						        	 <div class="left">
						       	 	   <span>${elem.imageText}</span>
						       	  </div>
						       	  <div class="right dot" id="${elem.image}" data-boardname="${elem.boardName}">
	        	            <img src="/images/three-dots.png" id="${elem.image}" class="dot" data-boardname="${elem.boardName}"/>
	                    </div>
						       </div>
					      </div> 
		        `;
		        indexForResponsive++;
		     }// Else condition
	    }// For loop
	    
	    /* 
	     > This will called again and again when new images will be appended
	     > If we dont do this then in some three dots event listener will;p not be applied
	    */
	    handleDeleteFunctionality()
	    
	    can_we_fetch_and_display_next_image = true;
	    if(columnsCount == undefined){
	      align_in_column();
	      
	      // calling hideTheLoader() function if status of responce is ok
	      hideTheLoader();
	    }
    } //If condition
	}	
}; // Ending of render image function
// Calling this function for only first time so some image can be loaded
renderImage()
//=============================================//




//---------------------------------------------//
//             MAKING MASONRY LAYOUT           //
//---------------------------------------------//
// It will deside the number of columns in image container
let totalRows = 2;


// This function will set the value of variable totalRows according to the width of image container
// This will help make columns according to width of screen to make it responsive
function columnSet(){
	 let width = window.innerWidth;
	 // If width is smaller than & equals to 580px then thre will be two columns
	 if(width <= 480){
	  	totalRows = 2;
	 }
	 
	 // If width is bigger than 400px & smaller than 787px then there will be 3 columns.
   if(width > 480 && width < 1001){
	  	totalRows = 3;
	 }
	 
	 // If width is bigger than 1000px & smaller than 1201px then there will be 4 columns.
   if(width > 1000 && width < 1201){
	  	totalRows = 4;
	 }
	 
	 // If width is bigger than 1200px & smaller than 1428px then there will be 6 columns.
   if(width > 1200 && width < 1428){
	  	totalRows = 6;
	 }
}
 columnSet()	



// Align the boxes properly when width of window will change
// Here all the image-boxes will be pushed in perfect order
let arrayOfImageBoxes = [];
// Previous width of window 
let previousWindowWidth = window.innerWidth;


// Resize event on window to make responsive when width is vchanged
window.addEventListener("resize", function(event){
	// Make the arrayOfImageBoxes array empty 
 	arrayOfImageBoxes = [];
 	// Calculating current width of window
	let currentWindowWidth = window.innerWidth;
	
	
	/*
	 > If currrent width of window is not equal to previous window width then =>
	 > It means width of window is changed
	 > Align the boxed in columns according to width of window
	*/
	if(currentWindowWidth != previousWindowWidth){
		/* 
		  > Now value of previousWindowWidth = currentWindowWidth
		  > If  we  dont do this then => 
		  > Sometimes this will not detect that window width is changed.
		*/
		previousWindowWidth = currentWindowWidth
		// This will help to find the image boxes accordong to its dataset 'index'
		let index = 0;
		// Getting all image bnoxes 
		let allImageBoxes = document.querySelectorAll(".images-box");
		
		// Loop on allImageBoxes to find it in a perfect order by its dataset 'index'
		for(const item of allImageBoxes){
			let imageBox = document.querySelector(`[data-index~='${index}']`);
			arrayOfImageBoxes.push(imageBox) 
			index++;
		}
	  // Increment the index so that we can find another image box
		index++;
		// Make innerHTML of images containet empty
		imagesContainer.innerHTML= "";
		
		// Appending the imageBoxes that are  stored arrayOfImageBoxes
		for(const item of arrayOfImageBoxes){
			imagesContainer.append(item)
		}
    
    // This function will calculate the number of columns  inside images-container
		columnSet();
		// This function will align the image-boxes properly in column
		align_in_column()
	}
});



// This function will align the image-boxes properly in column
function align_in_column(){
  itemCol = 0;
  // This will make correct numbers of column and append it to images container
  for(var rowCount = 0; rowCount < totalRows; rowCount++){
	  newCol = document.createElement('div');
	  newCol.className = 'col';
	  document.getElementsByClassName('image-container')[0].appendChild(newCol);
  }
  
  // This will align image boxes properly in generated columns
  for(var itemCount = 0; itemCount < document.getElementsByClassName('box').length; itemCount++){
	  document.getElementsByClassName('col')[itemCol].appendChild(document.getElementsByClassName('box')[0]);
	  if(itemCol < totalRows - 1){
	     itemCol++; 
	  } else {
	     itemCol = 0;
	  }
 }
 // This function will calculate the current number of columns
 getInfo()
}// End of function



/* 
  > This function will calculate the current number of columns
  > This will help renderImage function to appent image box in correct column
  > This will called only one time 
*/
function getInfo(){
 columns = document.querySelectorAll(".col")
 columnsCount = Array.from(columns).length;
}
//=============================================//



//---------------------------------------------//
//   HANDLING DELETE BUTTON AND FUNCTIONALITY  //
//---------------------------------------------//
/* When user click on three dots then =>
   1. Give id of three dotd to href of anchor.
   2. This will help to delete the desired image.
*/
function handleDeleteFunctionality(){
	// caption inside image box
	let caption = document.querySelectorAll(".caption");
	// Selecting three dots of all image box 
	let dot = document.querySelectorAll(".dot");
	
	
	caption.forEach((image)=>{ 
	 image.addEventListener("click", (e)=>{
	 	   // Checking elment if it contains class 'dot'
		   let classContain = e.target.classList.contains("dot");
		   // Getting boardNqme from our custom attribute
		   let boardName = e.target.dataset.boardname;
		 	 // If clicked element contains class 'dot', then perform delete functionality
		 	 if(classContain){
			 		anchorInsideDeleteBtn.href=`/deleteimage/${e.target.id}/${boardName}`;
				  //show the delete box
				  delBox.style.display = "flex" 
				  //giving bottom position to con of delBtn
				  delBox.style.bottom = "1%";
	 	   }
	 });
	});
}
//=============================================//



/* 
 > This will hide the loader.
 > This will be called inside render image function when all the all the images will be appended.
*/
function hideTheLoader(){
 setTimeout(()=>{
	 // Hide the loader
	 loaderOfPage.style.display = "none";
	 // Unhide the main container of page 
	 MainContainerOfWholePage.style.display = "block";	
 }, 100);
};
//=============================================//
}// This bracket is to make it block level element