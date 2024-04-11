// Like button 
const likeButton = document.getElementById('like');
// Dislike button
const dislikeButton = document.getElementById('dislike');
// Span that contain likes Number
let likeCounter = document.getElementById('likeSpan')
// Url of liked button
let urlOfLikedButton = '/images/thumbed-icon-white-color.png';
// url of liked button
let urlOfLikeButton = '/images/thumb-icon-white-color.png';
// Main container of actual comment section
let mainCommentContainer = document.getElementById("comment-ka-main-container");
// Default displaying comment
let dummyCommentBox = document.getElementById("comment-box");
// Main container of page
let mainContainerOfPage = document.querySelector(".main-container-of-page");
// Close button inside navbar of actual comment section
let commentCloseBtn = document.querySelector(".nav-comment-close-btn");
// conainer of comment boxes, where comment boxes will append
let commentBoxesContainer = document.querySelector(".container-of-boxes-of-comment");
// Wrapper inside comment boxes container, here comment boxes willm be apppended
let wrapperInsideCommentBoxesContainer = undefined;
// Loader inside post comment
let loaderInsidePostComment = document.getElementById("loader-inside-post-comment")
// Input type = text of post comment section to write comment
let textInputOfPostComment = document.querySelector(".input-text-of-post-comment");
// Main container of post comment section
let mainContainerOfPostComment = document.querySelector('.main-container-of-post-comment');
// Post botton in post comment section
let postComment = document.getElementById("post-comment-button");
// Loader inside actuall comment main-container
let loaderInsideActualCommentContainer = document.getElementById("loader-inside-actual-comment-con");
// Input type text for create new board
let inputForCreateNewBoard = document.getElementById("input-for-create-new-board-name");
// loader inside button create board 
let loaderInsideCreateBoard = document.querySelector(".loader-inside-create-board-btn");
// Span inside button create board 
let spanInsideCreateBoardButton = document.getElementById("span-inside-create-board-button");
// Sve button
let saveBtn = document.getElementById("save-box");
// Modal of save to board, appear on click of save button
let modalForSaving = document.querySelector(".save-image-modal");
// Close button inside save to board modal
let closeBtnOfSaveModal = document.querySelector(".cut-btn-of-modal-navbar");
// Wrapper inside save to board modal
let saveImageModalWrapper = document.getElementById("save-image-modal-wrapper");
// cotainer of board boxes displaying
let containerOfBoardBoxes = document.querySelector(".boards");
// Create new board button
let buttonToCreateNewBoard = document.querySelector(".create-new-board-button");
// Main container of page
let scroller = document.querySelector(".container-of-boxes-of-comment");
//=============================================//



//---------------------------------------------//
//           LIKE AND DISLIKE SECTION          //
//---------------------------------------------//
// If post is already liked then img src = liked button
if(likeButton.classList.contains('already_liked')){
	likeButton.src = urlOfLikedButton;
}
/* If post is already disliked then =>
   img src will be liked [liked button is used as disliked button] 
*/
if(dislikeButton.classList.contains('already_disliked')){
	dislikeButton.src = urlOfLikedButton;
}



// If you click on like button
likeButton.addEventListener('click', async (e)=>{
		// Getting postId from our custom attribute
		let postId = likeButton.dataset.postid;    
		// Getting userId from our custom attribute
		let userId = likeButton.dataset.userid;
		
		// If post is already liked 
		if(likeButton.classList.contains('already_liked')){
			 likeButton.src = urlOfLikeButton;
			 // It will tell that now user is not liked the p--ost
			 likeButton.classList.remove("already_liked");
			 // Getting value of current liked from innerHTML of likeCounter
			 let currentLikes = parseInt(likeCounter.innerHTML);
			 // Decrement the value of like counter by 1 because we are unliking the post
		   likeCounter.innerHTML = currentLikes - 1;
		}
		// Else, means if post is not liked
	  else{
	 	   likeButton.src = urlOfLikedButton;
	 	   dislikeButton.src = urlOfLikeButton;
	 	   // This will tell that now the post is liked
			 likeButton.classList.add("already_liked");
			 // Getting value of current likes from innerHTML of likeCounter
			 let currentLikes = parseInt(likeCounter.innerHTML);
			 // Now increment the value of likes because now resently we liked the post 
			 likeCounter.innerHTML = currentLikes + 1;
			 // Now post is liked, so that we are removing classList already_disliked from dislike button.
			 dislikeButton.classList.remove("already_disliked")
	 }
	  
	 // Sending request to like api
	 let data = await fetch(`/api/like/${postId}/${userId}`)
	 let responce = await data.json();
});



// If you click on dislike button
dislikeButton.addEventListener('click', async (e)=>{
		// Getting postId from our custom attribute
		let postId = likeButton.dataset.postid;
		// Getting userId from our custom attribute
		let userId = likeButton.dataset.userid;
		
		// If post is already disliked 
		if(dislikeButton.classList.contains('already_disliked')){
		   dislikeButton.src = urlOfLikeButton;
		   // removing class 'already_disliked' so that we can disit again
			 dislikeButton.classList.remove("already_disliked");
		}
		// Else, means if post is not disliked
		else{
		    dislikeButton.src = urlOfLikedButton;
		 	  likeButton.src = urlOfLikeButton;
		 	  // adding class 'already_disliked' so that we can undislike it again
		 	  dislikeButton.classList.add("already_disliked");
		 	  
		 	  // Getting number current likes by innerHTML of likeCounter
		 	  let currentLikes = parseInt(likeCounter.innerHTML);
		 	  // If user liked the post then only decrement the value of like counterer
		 	  if(likeButton.classList.contains('already_liked')){
			   likeCounter.innerHTML = currentLikes - 1;
	    	}
	    	/* 
	    	  > remove classList already_liked from like button 
	    	  > So that if post is liked then we can say that now it is no liked
	    	*/
	    	likeButton.classList.remove("already_liked")
		}
		 
		// Sending request to dislike api
		let data = await fetch(`/api/dislike/${postId}/${userId}`)
		let responce = await data.json();
});
//=============================================//



//---------------------------------------------//
//              COMMENTS SECTION               //
//---------------------------------------------//
// 1. Displaying comments with paginatrion
/*
  > If this is true then we can remove the loader inside comment boxes container
*/
let canWeRemoveLoaderInsideCommentBoxesContainet = true;

// Windth of screen
let widthOfScreen = window.innerWidth;
// Page number for pagination
let page = 0;
// Limit for items in a page 
let limit = 6;

// Setting  different limits on different width if screeen
// 1. Limit for srcreen, width less than and equal to 480px
if(widthOfScreen <= 480){
	limit = 12
}

// 2. Limit for srcreen, width is bigger than 400px & smaller than 787px
if(widthOfScreen > 480 && widthOfScreen < 787){
	limit = 16;
}

// 3. Limit for srcreen, width is bigger than 1000px & smaller than 1201px
if(widthOfScreen > 1000 && widthOfScreen < 1201){
 	limit = 20;
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

// If you scroll then renderImage function will be called
scroller.addEventListener("scroll", (e)=>{
  displayComments();
});


// Here generated html for comment box will be stored
let generatedHtml = '';
// This function will display  comments withy pagination
async function displayComments(){
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
		
		// if can_we_fetch_and_display_next_image == true, then only fetch and display
		if(can_we_fetch_and_display_next_image == true){
		  // If its value is false then we can't fetch and display images
			can_we_fetch_and_display_next_image = false;
			// Getting postId from our custom data from our like button
	    let postId = likeButton.dataset.postid;    
			// Increare the value of page by 1 so that we can fetch next comments
			page += 1;
			// Empty the generatedHtml. so that no comments will be dispalyed multiple times
			generatedHtml = "";
			
			// Get requet to the api responsible for displaying images
			// It will return array of post images from post model
			let data = await fetch(`/pagination/getcomments/${limit}/${page}/${postId}`);
			let responce = await data.json();
      
      // If responce is ok canWeRemoveLoaderInsideCommentBoxesContainet = true =>
			if(responce.status == 'ok' && canWeRemoveLoaderInsideCommentBoxesContainet == true){
				// Getting loader-inside-comment-boxes-con
				let loaderInsideCommentBoxesContainer = document.getElementById("loader-inside-comment-boxes-con");
				// Removing that loader because we have to display comments
				loaderInsideCommentBoxesContainer.remove();
				// Inside this element comment boxes will be append
				// It is because we have to make the comment boxes container default scrolable
				commentBoxesContainer.innerHTML = `
				 <div class="wrapper-inside-comment-boxes-container"> </div>
				`;
				// Now selecting that wrapper-inside-comment-boxes-container
				wrapperInsideCommentBoxesContainer = document.querySelector(".wrapper-inside-comment-boxes-container");
				// False it, because loader is now rwmoved we dont need to remove it again
				canWeRemoveLoaderInsideCommentBoxesContainet = false;
			}
			
			// Prepare html for each post data
	    for(const elem of responce.data){
		      	generatedHtml += `
				      <div class="comment-box">
						     <div class="img-container">
					          <img src="/images/uploads/${elem.profileImage}"/>
					        </div>
					        <span>
						          <p class="commenter-name">
						            ${elem.username}
						          </p>
						          <!-- paragraph of comment -->
						          <p class="paragraph-of-comment">
						            ${elem.content}
						          </p>
					        </span>
               </div>
		        `;
	    }// For loop
	    // Appending html stored inside generatedHtml to wrapperInsideCommentBoxesContainer
	    wrapperInsideCommentBoxesContainer.innerHTML += generatedHtml;
	    can_we_fetch_and_display_next_image = true;
    } //If condition
	}	
}; // Ending of displayComments function



// 2. Displaing all comments when you click on dummy comment box by calling a function
dummyCommentBox.addEventListener('click', ()=>{
	 mainContainerOfPage.style.display = "none";
	 mainCommentContainer.style.display = "grid";
	 //Empty the generatedHtml variable
	generatedHtml = "";
	// Displaying loader
	commentBoxesContainer.innerHTML = `
	   <span class="loader-container" id="loader-inside-comment-boxes-con">
			  <div class="loader"></div>
	   </span>
	`;
	 displayComments();
});
//hiding comment section when you click on cut button
commentCloseBtn.addEventListener('click', ()=>{ 
	 mainCommentContainer.style.display = "none";
	 mainContainerOfPage.style.display = "block";
	 canWeRemoveLoaderInsideCommentBoxesContainet = true;
	 page = 0
});



// 3. When you click on post comment button then post the comment
postComment.addEventListener('click', async (e)=>{
	let commentContent = textInputOfPostComment.value;
	let username = mainContainerOfPostComment.dataset.username;
	let profileImage = mainContainerOfPostComment.dataset.profileimage;
	let postId = mainContainerOfPostComment.dataset.postid;
	
	// If we dont do this then server will be crashed because commentText is required in mongoose model
	if(commentContent != ""){
		// Empty the input text field
		textInputOfPostComment.value = '';
		
		// Gererating html for posted comment
		let htmlOfCommentBox = `
			 <div class="comment-box">
				  <div class="img-container">
		        <img src="/images/uploads/${profileImage}"/>
		      </div>
			    <span>
				     <p class="commenter-name">
				       ${username}
				     </p>
				     <!-- paragraph of comment -->
				     <p class="paragraph-of-comment">
				       ${commentContent}
				     </p>
			    </span>
			 </div>
		`;
		
		// Appending that posted comment to just begining of container of boxes of comment
		commentBoxesContainer.insertAdjacentHTML('afterbegin', htmlOfCommentBox);
		// Comment is posted then it wll automatically scroll to top
		commentBoxesContainer.scrollTop = '0';
		
		// Data of comment that we need to send to backend
		let commentData = {
			 content: commentContent,
		}
		let options = {
			 method: "POST",
			 headers: {
		     "Content-Type": "application/json",
		   },
		   body: JSON.stringify(commentData),
		}
		
		// Hide the post comment button
		postComment.style.display = 'none';
		// Inplace if post comment button dispaly there a loader
		loaderInsidePostComment.style.display = 'flex';
		
		// Send post request to backend for post comment api
		let data = await fetch(`/api/comment/${postId}`, options);
		let responce = await data.json();
		
		/* If comment is succesfully posted then =>
		   1. Hide the loader
		   2. Show post comment button
		*/
	  if(responce.status == 'comment created'){
	    postComment.style.display = 'block';	
	    loaderInsidePostComment.style.display = 'none';
	  }
	} // If commentContent != ""
});
//=============================================//




//---------------------------------------------//
//             SAVE IMAGE SECTION              //
//---------------------------------------------//
// If you click on save icon then save modal will be shown
saveBtn.addEventListener("click", ()=>{
	modalForSaving.style.display = "flex";
	mainContainerOfPage.style.opacity = "0.4";
	modalForSaving.style.bottom = "0px";
});



// If you clicik on close button then modal will hide 
closeBtnOfSaveModal.addEventListener("click", ()=>{
	modalForSaving.style.bottom = "-100%";
	modalForSaving.style.display = "none";
	mainContainerOfPage.style.opacity = "1";
});



// Save to already existing board, functionality
containerOfBoardBoxes.addEventListener("click", async (e)=>{
	// Getting index of clicked box from our custom attribute
	let indexOfBoardBox = e.target.dataset.indexofbox;
	// Getting clicked box accrordong to given index of clicked box
	let clickedBox = containerOfBoardBoxes.getElementsByClassName("box")[indexOfBoardBox];
	// Paqragraph tag inside cliked box
	let paraInsideClickedBox = clickedBox.querySelector("p");
	// Loader inside clicked box
	let loader = clickedBox.querySelector(".loader-container");
	
	
	// Hinding the paragraph of clicked box
	paraInsideClickedBox.style.display = "none";
	// Hinding the loader of clicked box
	loader.style.display = "flex";
	
	// This data will go through body of post request
	let dataToSave = { 
		 boardName : e.target.dataset.boardname,
		 image : saveImageModalWrapper.dataset.image,
	   imageText : saveImageModalWrapper.dataset.imagetext,
		 description : saveImageModalWrapper.dataset.description,
	}
	
	// Options por post request
	let options = {
		 method: "POST",
		 headers: {
	     "Content-Type": "application/json",
	   },
	   body: JSON.stringify(dataToSave),
	}
	let data = await fetch(`/api/savetoboard`, options);
	let responce = await data.json();
	
	// Hiding loader of clicked box
	loader.style.display = "none";
	// Unhiding paragarah of clicked bbox 
	paraInsideClickedBox.style.display = "flex";
	
	// Now hiding the save modal
	modalForSaving.style.bottom = "-100%";
	modalForSaving.style.display = "none";
	mainContainerOfPage.style.opacity = "1";
});



// Create new board functionality
buttonToCreateNewBoard.addEventListener("click", async (e)=>{
	// Getting board name from input field
	let boardName = inputForCreateNewBoard.value;
	// If input fiels is empty then return from here 
	if(boardName == ""){
	  return;
	}
	
	// Getting width of create new board button
	let boundingClient = buttonToCreateNewBoard.getBoundingClientRect();
	/*
	  setting width of create new board button to its orgional width because =>
	  * when its para will hide then it's width will become smaller
	*/
	buttonToCreateNewBoard.style.width = `${boundingClient.width}px`;
	
	// Hiding paragraph inside create new board button
	spanInsideCreateBoardButton.style.display = 'none';
	// Unhiding the loader
	loaderInsideCreateBoard.style.display = "flex";
	
	// This data will go through body of post request
	let dataToSave = { 
		 boardName : boardName,
		 image : saveImageModalWrapper.dataset.image,
	   imageText : saveImageModalWrapper.dataset.imagetext,
		 description : saveImageModalWrapper.dataset.description,
	}
	// Options for creating post request
	let options = {
		 method: "POST",
		 headers: {
	     "Content-Type": "application/json",
	   },
	   body: JSON.stringify(dataToSave),
	}
	let data = await fetch(`/api/createnewboard`, options);
	let responce = await data.json();
	
	// Unhiding   paragraph inside button of create new board
	spanInsideCreateBoardButton.style.display = 'block';
	// Hinding the loader inside button of create new board
	loaderInsideCreateBoard.style.display = "none";
	
	// Now hiding the save  modal
	modalForSaving.style.bottom = "-100%";
	modalForSaving.style.display = "none";
	mainContainerOfPage.style.opacity = "1";
});
//=============================================//