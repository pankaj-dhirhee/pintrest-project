const router = require("./index")
const postModel = require("../models/posts");
const userModel = require("../models/User.js");
const commentModel = require("../models/comments");
const checkUserAuth = require('../middlewares/auth-middleware.js');
const disable_browser_cache = require("../middlewares/disable-browser-cache.js");


//---------------------------------------------//
//            LIKE AND DISLIKE API             //
//---------------------------------------------//
// Function to like the post
const like = async (req, res) =>{
   try{
		  const postId = req.params.postId;
			const userId = req.params.userId;
	    const postExist = await postModel.findById(postId);
	    const userExist = await userModel.findById(userId);
	    
	    // If post is not exist
	    if(!postExist){
	    	return res.status(400).json({
	    		message: "Post not found"
	    	});
	    }
	    
	    // If user is not in database
	    if(!userExist){
	    	return res.status(400).json({
	    		message: "user not found"
	    	});
	    }
	    
	    // If user has already liked the post
	    if(postExist.likedBy.includes(userId)){
	    	postExist.likedBy.pull(userId);
	    	postExist.likes -= 1;
	    	await postExist.save();
	    	return res.status(400).json({
	    		message: "Post already liked"
	    	})
	    }
	    
	    // If user has already disliked the post 
	    if(postExist.dislikedBy.includes(userId)){
	    	postExist.dislikedBy.pull(userId);
	    	postExist.dislikes -= 1;
	    }
	    
	    // Push user's id to likes array inside postScheam 
	    postExist.likedBy.push(userId);
	    // Increment the value if by from 1 
	    postExist.likes += 1;
	    // Save all this changes
	    const savedLikes = await postExist.save();
	    // Send changes in responce
	    res.status(200).json(savedLikes);
	 } catch(error){
	  	res.status(500).json({error: error});
	 }
}; // End of like function



// Function to dislike the post
const dislike = async (req, res) =>{
  try{
			const postId = req.params.postId;
			const userId = req.params.userId;
	    const postExist = await postModel.findById(postId);
	    const userExist = await userModel.findById(userId);
	    
	    // If post is not exist
	    if(!postExist){
	    	return res.status(400).json({
	    		message: "Post not found"
	    	});
	    }
	    
	    // If user is not in database
	    if(!userExist){
	    	postExist.dislikedBy.pull(userId);
	    	return res.status(400).json({
	    		message: "user not found"
	    	});
	    }
	    
	    // If user has already disliked the post
	    if(postExist.dislikedBy.includes(userId)){
	    	postExist.dislikedBy.pull(userId);
	    	postExist.dislikes -= 1;
	    	await postExist.save();
	    	return res.status(400).json({
	    		message: "Post already disliked"
	    	})
	    }
	    
	    // If user has already liked the post 
	    if(postExist.likedBy.includes(userId)){
	    	postExist.likedBy.pull(userId);
	    	postExist.likes -= 1;
	    }
	    
	    // Push user's id to dislikes array inside postScheam 
	    postExist.dislikedBy.push(userId);
	    // Increment the value if dislikes by 1 
	    postExist.dislikes += 1;
	    // Save all this changes
	    const savedDislikes = await postExist.save();
	    // Send changes in responce
	    res.status(200).json(savedDislikes);
	 } catch(error){
	  	res.status(500).json({error: error});
 	}
}; // End of dislike function
//=============================================//




//---------------------------------------------//
//                 COMMENTS API                //
//---------------------------------------------//
// Function to create a new comment
const createComment = async (req, res) => {
	const user = await userModel.findOne({
		username: req.user.username,
	});
	let comment = await commentModel.create({
		content: req.body.content,
		postId: req.params.postId,
		createdBy: user._id,
		profileImage: user.profileImage,
		username: user.username,
	});
	return res.json({
		status: 'comment created'
	});
};


// Function to get all the comments
const getAllComments = async (req, res) => {
  const user = await userModel.findOne({
		username: req.session.user.username,
	});
	let comment = await commentModel.find({
		postId: req.params.postId,
	});
	return res.send(comment);	
};
//=============================================//




//---------------------------------------------//
//          API FOR SAVE FUNCTIONALITY         //
//---------------------------------------------//
// Save image to the already existing board board
const saveToAlreadyExistingBoard = async (req, res)=>{
		let boardName = req.body.boardName;
		let image = req.body.image;
		let imageText = req.body.imageText;
		let description = req.body.description;
		
		// Getting data of logged in user
		let user = await userModel.findOne({
			 username: req.user.username
		}); 
		
		// If the give boardName if not existing 
		if(!user.boards.includes(boardName)){
			user.boards.push(boardName);
		  await user.save();
		}
		
		// Creating new post data to save it 
		await postModel.create({
	  	 boardName: boardName,
			 image: image,
			 imageText: imageText,
			 description: description,
			 user: user._id,
	  });
	  
	 res.json({status: "Saved"})
};



// Function to Create new board 
const createNewBoard = async (req, res)=>{
	// Getting data of logged in user
	let user = await userModel.findOne({
		 username: req.user.username
	}); 
	
	// Getting required data from req.body
	let boardName = req.body.boardName;
	let image = req.body.image;
	let imageText = req.body.imageText;
	let description = req.body.description;
	
	
	 // If the given board is not already existing then only\
	 // It will not create the save board mutiple times
	if(!user.boards.includes(boardName)){
		user.boards.push(boardName);
	  await user.save();
	}
	
	// Creating new data so we can save it to post model
	await postModel.create({
  	boardName: boardName,
		image: image,
		imageText: imageText,
		description: description,
		user: user._id,
	}); 
	res.json({status: "Board created"})
};
//=============================================//




//---------------------------------------------//
//          DELETE BOARD FUNCTIONALITY         //
//---------------------------------------------//
// This will delete the given board and all posts inside it
const deleteBoard = async (req, res) => {
	let boardName = req.params.board_name;
	let userId = req.params.user_id;
	
	let deleatedPost = await postModel.deleteMany({
		user: userId,
		boardName: boardName,
	});
	
	res.json({
	  status: "success"
	})
}
//=============================================//




//---------------------------------------------//
//        ROUTES TO CALL THESE FUNCTIONS       //
//---------------------------------------------//
// Route to like the post
router.get('/like/:postId/:userId', checkUserAuth, like)

// Route to dislike the post
router.get('/dislike/:postId/:userId', checkUserAuth, dislike)

// Route to create a new comment
router.post("/comment/:postId", checkUserAuth, createComment);

// Route to get all the comment according to post
router.get("/getcomments/:postId", checkUserAuth, getAllComments);

// Route to save image to already existing board
router.post('/savetoboard', checkUserAuth, saveToAlreadyExistingBoard);

// Route to crewate new board
router.post('/createnewboard', checkUserAuth, createNewBoard);

// Route to delete the board
router.get('/deleteboard/:user_id/:board_name', checkUserAuth, deleteBoard);
//=============================================//

module.exports = router;