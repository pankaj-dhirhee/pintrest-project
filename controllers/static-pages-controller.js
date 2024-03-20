const express = require('express');
const router = express.Router();
const userModel = require("../models/User.js");
const postModel = require("../models/posts");
const commentModel = require("../models/comments");
const session = require('express-session');
const upload = require("./multer")
const fs = require("fs");
const path = require('path');
const checkUserAuth = require('../middlewares/auth-middleware.js');
const jwt = require('jsonwebtoken');
const disable_browser_cache = require("../middlewares/disable-browser-cache.js");



class static_pages_controller {
  // 1. Rendering feed feed page
  static render_feed_page = (req, res) =>{
    res.render('feed');
  }; // End of 'render_feed_page' function
  
  
  // 2. Rendering profile page
  static render_profile_page = (req, res) => {
    let requested_user = req.user;
  	const user = await userModel.findOne({
  		 username: requested_user.username,
  	});
  	.populate("posts").populate("boards");
  	
  	// Preparing data for boards
  	let boardData = [];
    let totalData = [];	
    
    /*
      1. Run for of loop on boards array of user  
      2. Get 1 data for each board
      3. Store it to boardData variable
    */
  	for (const item of user.boards){
  			let board = item;
  			let data = await postModel.findOne({
  					user: user._id,
  					boardName: board,
  		  });
  		
  		  /* 
  		     If data is null then it means =>
  		     1. that board has not having any image saves in it 
  		     2. so delete that board from boards array of user
  		  */
  		  if(data == null && board != 'Your uploads'){
  					user.boards.pull(board)
  					await user.save();
  		  }
  		  
  		  // If data is not = null then only do these operations
  		  /* 
  		    If we dont do these then =>
  		    1. Null data will be pushed to boardData array this can cause error.
  		    2. Length of null data '0' will be pushed to totalData array.
  		  */
  		  if(data != null){
  				  // Getting numbers of data for given board 
  				  nummberOfData = await postModel.find({
  							user: user._id,
  							boardName: board,
  				  }).count();
  				  
  				  totalData.push(nummberOfData);
  				  //If data id not null then only push it to boardData
  				  boardData.push(data);	
  		  }
  	};
  	res.render('profile', {user, boardData, totalData});  
  }; // End of 'render_profile_page' function
  
  
}; // End of class 'static_pages_controller'



// Rendering profile page
router.get("/profile", disable_browser_cache, checkUserAuth, async function(req, res, next){
  let requested_user = req.user;
  
	const user = await userModel.findOne({
		 username: requested_user.username,
	})
	.populate("posts").populate("boards");
	
	// Preparing data for boards
	let boardData = [];
  let totalData = [];	
  
  /*
    1. Run for of loop on boards array of user  
    2. Get 1 data for each board
    3. Store it to boardData variable
  */
	for (const item of user.boards){
			let board = item;
			let data = await postModel.findOne({
					user: user._id,
					boardName: board,
		  });
		
		  /* 
		     If data is null then it means =>
		     1. that board has not having any image saves in it 
		     2. so delete that board from boards array of user
		  */
		  if(data == null && board != 'Your uploads'){
					user.boards.pull(board)
					await user.save();
		  }
		  
		  // If data is not = null then only do these operations
		  /* 
		    If we dont do these then =>
		    1. Null data will be pushed to boardData array this can cause error.
		    2. Length of null data '0' will be pushed to totalData array.
		  */
		  if(data != null){
				  // Getting numbers of data for given board 
				  nummberOfData = await postModel.find({
							user: user._id,
							boardName: board,
				  }).count();
				  
				  totalData.push(nummberOfData);
				  //If data id not null then only push it to boardData
				  boardData.push(data);	
		  }
	};
	res.render('profile', {user, boardData, totalData});
});






// Rendering inbox page
router.get('/inbox', (req, res)=>{
	res.render('inbox')
})


// Rendering search page
router.get('/search', (req, res)=>{
	res.render('search');
});


// Route to handel search functionality
router.get('/username/:query', async (req, res)=>{
	let regex = new RegExp(`${req.params.query}`, 'i');
	const users = await postModel.find({
		imageText: regex,
	});
	res.json(users);
});


// Dispaly post image detail in specific page
router.get('/preview/:image_url', checkUserAuth, async (req, res)=>{
	// Getting post data according to the given image url
	let post = await postModel.findOne({
		 image: req.params.image_url,
	});
	// Getting data of logged in user
	let user = await userModel.findOne({
		 username: req.user.username
	});
	// Getting comment data according to post id
	let comment = await commentModel.find({
		 postId: post._id,
	});
	
	let isLiked = 'not_liked';
	let isDisliked = 'not_disliked';
	// If post is already liked
	if(post.likedBy.includes(user._id)){
    isLiked = 'already_liked';
	}
	// If post is already disliked
  if(post.dislikedBy.includes(user._id)){
    isDisliked = 'already_disliked';
	} 
	
	res.render('preview', {post: post, user: user, liked: isLiked, disliked: isDisliked, comments: comment});
});
// Its's ending



// Route to upload image files
router.post("/upload/:board_name", checkUserAuth, upload.single("file"), async function(req, res, next){
	let boardName = req.params.board_name;
	let fileName = req.file.filename;
	
	// If file is not given
	if(!req.file){
	  	return res.status(404).send(" no file were given");
	}
	// Getting data of logged in user
	const user = await userModel.findOne({
		 username: req.user.username
	});
	// creating data so we can save it to post model
	const post = await postModel.create({
		 boardName: boardName,
		 image: fileName,
		 imageText: req.body.filecaption,
		 description: req.body.description,
		 user: user._id,
	});
	
	user.posts.push(post._id);
	await user.save();
	
	res.json({
		status: 'ok',
		newUploadedFile: fileName,
	});
});



//Uploading profile image & deleting provious profile image
router.post('/fileupload/:imgurl', checkUserAuth, upload.single("image"), async function(req, res, next){
	// Getting data of logged in user
	const user = await userModel.findOne({
		username: req.user.username
	});
	let imageUrl = req.params.imgurl;
	
	// If profile image is already in uplods folder then delete it
	if(user.profileImage != 'blue-backgroung.jpeg'){
	   fs.unlink(path.join(__dirname, '..', 'public', 'images', 'uploads', `${imageUrl}`), function(err){
		    if(err) throw err;
	   });
	}
	
	// Store url of profile image to database
	let urlOfNewProfileImage = req.file.filename;
	user.profileImage = urlOfNewProfileImage;
	await user.save();
	
	// If profile is changed we are updating profilr image of that user in comments model
	let commentsOfUser = await commentModel.updateMany(
		{createdBy : user._id},
		{$set : {profileImage: urlOfNewProfileImage}}
	)
	res.json({
		newProfileImage: urlOfNewProfileImage,
		status: 'ok',
	});
});



// Route to delete iamges on click of delete button
router.get('/deleteimage/:imageurl/:boardName', checkUserAuth, async (req, res)=>{
	let imageUrl = req.params.imageurl;
	let boardName = req.params.boardName;
	
	// Getting data of logged in user
	const user = await userModel.findOne({
		 username: req.user.username,
	});
	
	// Deleting that post from db
	let deleatedPost = await postModel.findOneAndDelete({
		boardName: boardName,
		image: imageUrl,
		user: user._id,
	});
	
	// Deleating the post id from posts arrray of user
	user.posts.pull(deleatedPost._id);
	await user.save();
	
	/* 
	  If board name is 'Your uploads' then =>
	  1. Delete file from uploads folder
	*/
	/*
	  If we dont use this condition then =>
	  1. if we delete image from any another board, then after that in search suggestiong & preview page that iamge will be brocken
	*/
	if(boardName == "Your uploads"){
			fs.unlink(path.join(
			  __dirname, '..', 'public', 'images', 'uploads', `${imageUrl}`
			), function(err){
				  if(err) throw err;
			});
	}
  res.redirect(req.get('referer'))
});



//Show all pins of user in specific page
router.get('/show/:board_name', checkUserAuth, async (req, res, next)=>{
	// Getting data of logged in user
	const user = await userModel.findOne({
		 username: req.user.username,
	});
	let boardName = req.params.board_name;
	res.render("imgshow", {user, boardName});
});



// Route to download image on click of download button 
router.get('/download/:image_url', (req, res)=>{
	const file = path.join(__dirname, '..', 'public', 'images', 'uploads', `${req.params.image_url}`);
  res.download(file);
});

module.exports = router;