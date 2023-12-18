// Like button 
const likeButton = document.getElementById('like');
// Dislike button
const dislikeButton = document.getElementById('dislike');
// Span that contain likes Number
let likeCounter = document.getElementById('likeSpan')
// Url of liked button
let urlOfLikedButton = '/images/liked-btn.png';
// url of liked button
let urlOfLikeButton = '/images/like-btn.png';



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
			 likeButton.classList.remove("already_liked");
			 let currentLikes = parseInt(likeCounter.innerHTML);
		   likeCounter.innerHTML = currentLikes - 1;
		}
		// Else, means if post is not liked
	  else{
	 	   likeButton.src = urlOfLikedButton;
	 	   dislikeButton.src = urlOfLikeButton;
			 likeButton.classList.add("already_liked");
			 let currentLikes = parseInt(likeCounter.innerHTML);
			 likeCounter.innerHTML = currentLikes + 1;
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
			 likeButton.classList.remove("already_disliked");
		}
		// Else, means if post is not disliked
		else{
		    dislikeButton.src = urlOfLikedButton;
		 	  likeButton.src = urlOfLikeButton;
		 	  likeButton.classList.add("already_disliked");
		 	  let currentLikes = parseInt(likeCounter.innerHTML);
			  likeCounter.innerHTML = currentLikes - 1;
		}
		 
		// Sending request to dislike api
		let data = await fetch(`/api/dislike/${postId}/${userId}`)
		let responce = await data.json();
});