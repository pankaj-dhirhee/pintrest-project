const router = require("./index")
const postModel = require("./posts");
const userModel = require("./users");


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


// Route to like the post
router.get('/like/:postId/:userId', like)

// Route to dislike the post
router.get('/dislike/:postId/:userId', dislike)

module.exports = router;