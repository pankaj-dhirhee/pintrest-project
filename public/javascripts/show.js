{
// Dropdown menu that will be shown onclick of three dotd inside image box
let dropdown_menu_for_image_box = document.querySelector(".dropdown-menu-for-image-box");
// Delete button inside dropdown menu
let delete_button = document.querySelector(".delete-btn")
// Loader inside delete button
let loader_of_delete_btn = document.getElementById("loader-of-delete-btn")
// Loader container | Loader of page
let loaderOfPage = document.querySelector(".loader-of-page");
// Main containet of page
let MainContainerOfWholePage = document.querySelector(".main-container-of-page");
// This is also main container of page
let mainContainerOfPage = document.querySelector(".main-container-of-page");
// images container | here all image boxes will be displayed
let imagesContainer = document.querySelector(".image-container");
// Main container of page | Used to display more images when page would scroll
let scroller = document.querySelector(".main-container-of-page");
// Getting boardName from our custom attribute
boardName = imagesContainer.dataset.boardname;
// This will cover the whole screen when dropdown menu will be shown to prevent action if anchor tag and by clicking it user can hide dropdown menu
let page_cover = document.querySelector(".cover-outside-the-dropdown");



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



let skip_bach_post_data = 0;
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
	// Initially valoe will be 0
	currentCol = 0;
	
	/* This will tell that, from which column we have to start appending new iamges.
	   Suppose we deleated one image. suppose now there is 3 columns,
	   so we need to start appending image from column number 3 not 0.
	   This block of code is solving this problem.
	*/
	try{
	  // Getting number of image box
	  let number_of_image_box = document.querySelectorAll(".box").length;
	  /* Here we are getting remainder by dividing 'number_of_image_box' by 'totalRows'
	     suppose now number_of_image_box = 8 totalRows (number of column) = 3.
	     So by divinding '8 divided by 3', remainder will be 2.
	     If we add 'remainder + 1', so the value will be number of column from where we need to start appending new image. 
	     If you see then you will notice that we are not doing 'remainder + 1' in 'currentCol = remainder'  because,
	     Value of currentCol will be later incremented by code
	  */
	  /* In first time when this function will be called, currentCol will not initialised.
       To avoid this error this is why here is try catch block   	  
	  */
	  let remainder = number_of_image_box % totalRows;
	  if(remainder!= 0){
	    // currentCol will deside that, from which column, images will be start appending
	    currentCol = remainder;  
	  } 
	}catch(error){
	  
	}
	
	
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
			let data = await fetch(`/show/${limit}/${page}/${skip_bach_post_data}/${boardName}`);
			let responce = await data.json();
			
			// Prepare html for each post data
	    for(const elem of responce.data){
	     /*
	       > If columnsCount is undefined then insert html normally.
	       > Because we will araage these in columns by a function named align_in_column
	     */
	     if(columnsCount == undefined){
			     imagesContainer.innerHTML += `
		           	<div class="box images-box" data-index="${indexForResponsive}" data-imageboxindex="${indexForResponsive}">
						       <a href="/preview/${elem.image}">
						          <img src="/images/uploads/${elem.image}" />
						       </a>
						       <div class="caption">
						        	 <div class="left">
						       	 	   <span>${elem.imageText}</span>
						       	  </div>
						       	  <div class="right dot container-of-three-dot-image" id="${elem.image}" data-boardname="${elem.boardName}" data-indexofdotbtn="${indexForResponsive}">
	        	            <img src="/images/three-dots.png" id="${elem.image}" class="dot three-dot-image" data-boardname="${elem.boardName}" data-indexofthreedotimage="${indexForResponsive}"  data-indexofdotbtn="${indexForResponsive}"/>
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
				      <div class="box images-box" data-index="${indexForResponsive}" data-imageboxindex="${indexForResponsive}">
						       <a href="/preview/${elem.image}">
						          <img src="/images/uploads/${elem.image}" />
						       </a>
						       <div class="caption">
						        	 <div class="left">
						       	 	   <span>${elem.imageText}</span>
						       	  </div>
						       	  <div class="right dot container-of-three-dot-image" id="${elem.image}" data-boardname="${elem.boardName}" data-indexofdotbtn="${indexForResponsive}">
	        	            <img src="/images/three-dots.png" id="${elem.image}" class="dot three-dot-image" data-indexofthreedotimage="${indexForResponsive}" data-boardname="${elem.boardName}"/>
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
	    show_dropdown_menu_onclick_of_three_dots_of_image_box()
	    
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


//let index_for_delete_functionality = 0;
// This function will align the image-boxes properly in column
function align_in_column(){
  index_for_delete_functionality = 0;
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
  
  // Adding event listener to caption inside all image boxes
  caption.forEach((image)=>{ 
    image.addEventListener("click", (e)=>{
 	    // Checking elment if it contains class 'dot'
	    let classContain = e.target.classList.contains("dot");
	    // Getting boardNqme from our custom attribute
	    let boardName = e.target.dataset.boardname;
	    // Getting userId from our custom attribute
	    let userId = e.target.dataset.userid;
	    
	 	  // If clicked element contains class 'dot', then show dropdown menu
	 	  if(classContain){
	      /* Setting a url in custom attribute to delete button,
	         This url will be used to delete the correct image.
	      */
		 		delete_button.dataset.deleteinfo = `/deleteimage/${e.target.id}/${boardName}`;
		 		/* Setting index of clicked element to delete button.
		 		   This index will help to remove the correct image box, from image boxes container.
		 		*/
		 		delete_button.dataset.clickeddotindex = e.target.dataset.indexofdotbtn;;
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
			    dropdown_menu_for_image_box.style.right = right + "px";
			    // Setting top position of dropdown menu
			    dropdown_menu_for_image_box.style.top = top + "px";
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
 	   };
   });
 });
}; // show_dropdown_menu_onclick_of_three_dots_of_image_box()
//=============================================//



//---------------------------------------------//
//   HANDLING DELETE BUTTON OF DROPDOWN MENU   //
//---------------------------------------------//
function delete_button_event_listener(){
  // By clicking delete  button you can delete image or a post
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
    
    // If responce status id success, then the post is deleated succesfully
    if(responce.status == "success"){
      // this block of code is removing the deleated post from the image container
      let index_of_clicked_dot = delete_button.dataset.clickeddotindex;
      let element_to_be_removed = document.querySelector(`[data-imageboxindex~="${index_of_clicked_dot}"]`);
      element_to_be_removed.remove();
      skip_bach_post_data++;
      
      /* This function is arranging image boxes in proper order 
         If one image box is removed from image container then =>
         We need to arrange the image boxes in proper order
      */
      function arrange_image_boxes_in_proper_order(){
        /* This index will help to fing image boxes in proper order.
           Inside image container initially there are columns.
           Inside each column there are image boxes.
           So index 0 (zero) means first image box inside first column,
           Index 1 mens first image box inside second column.
           So this index wirk like this to find image box in proper order
        */
    		let index = 0;
    		let allImageBoxes = document.querySelectorAll(".images-box");
    		
    		// Loop on allImageBoxes to find it in a perfect order by its dataset 'index'
    		for(const item of allImageBoxes){
    		  // Finding image box on the basis of its index
    		  let imageBox = document.querySelector(`[data-index~='${index}']`);
    		  /* untill valiable 'imageBox' is null, increment the index value and find image box again untill then then the next image box.
    		     Suppose that, we deleated image box of index 3, then =>
    		     This while loop is not needed till the image box of index 2.
    		     After index 2, variable 'imageBox' will return null value.
    		     Here comes while loop to solve this problem.
    		  */
      		while(imageBox == null){
      			 if(imageBox == null){
                index++
                imageBox = document.querySelector(`[data-index~='${index}']`);
      			 };
      		};
      		// We are pushing the selected image box to an array named 'arrayOfImageBoxes'
    		  arrayOfImageBoxes.push(imageBox)
    			index++;
    		};
    
    		// Now all the image boxes are in an array, so clear the innerHTML of image container
    		imagesContainer.innerHTML= "";
    		// Appending the imageBoxes that are  stored arrayOfImageBoxes
    		for(const item of arrayOfImageBoxes){
    			imagesContainer.append(item)
    		}
        
        // This function will calculate the number of columns to be inside images-container
    		columnSet();
    		// This function will align the image-boxes properly in column
    	  align_in_column()
      }; // function arrange_image_boxes_in_proper_order()
      arrange_image_boxes_in_proper_order()
      
      // Now unhide the text inside delete button
      delete_button.querySelector(".btn-text").style.display = "inline";
      // Hide the loader of delete button
      loader_of_delete_btn.style.display = "none";
      // Hide the dropdown menu
      dropdown_menu_for_image_box.style.display = "none";
      // This is a div element that covers whole page when three dot is clicke to avoid click of anchor tags
      page_cover.style.display = "none";
  	}// If responce is success
}); // Event listener of delete button
}; // function delete_button_event_listener()
delete_button_event_listener();
//=============================================//




/* This will hide the loader.
   This will be called inside render image function when all the all the images will be appended. 
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

} //  This is to make this code in a block level 