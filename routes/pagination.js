const router = require("./index")
const postModel = require("./posts");
const userModel = require("../models/User.js");
const commentModel = require("./comments");
const checkUserAuth = require('../middlewares/auth-middleware.js');


// Rendering image with pagination for feed page
router.get('/feed/:limit/:page', async (req, res, next)=>{
	// Getting page number for pagination
	let page = Number(req.params.page) || 1;
	// Getting limit for pagination
	let limit = Number(req.params.limit) || 4;
	// calculating what number of post data will skip
	let skip = (page - 1) * limit;
	
	
	// Getting post data with skip and limit values
  let posts = await postModel.find().skip(skip).limit(limit);
  // This will be sent in responce so that we can make sure responce is ok
  // Post data will be sent in data key inside this object
  let object = {
  	status: 'ok',
  	data: posts,
  };
  // Finnaly sending prepared data in responce
  res.json(object);
});




// Rendering image with pagination for imgShow page
router.get('/show/:limit/:page/:board_name', checkUserAuth, async (req, res, next)=>{
	// Getting page number for pagination
	let page = Number(req.params.page) || 1;
	// Getting limit for pagination
	let limit = Number(req.params.limit) || 4;
	// calculating what number of post data will skip
	let skip = (page - 1) * limit;
	
	// Getting data of logged in user
	const user = await userModel.findOne({
		 username: req.user.username,
	});
	
	let imagesData = "";
	let boardName = req.params.board_name;
	/*  
	  If board name is 'Your uploads' then =>
	  imagesData = post array of user
	*/
	if(boardName == "Your uploads"){
	  user.populate("posts");	
	  imagesData = await postModel.find({
	  	user: user._id,
			boardName: boardName,
	  }).skip(skip).limit(limit);
	}else{
		// Getting post data accvording to given user-id & board name
		let posts = await postModel.find({
			user: user._id,
			boardName: boardName,
		}).skip(skip).limit(limit);
		imagesData = posts;
	}
	
	// This will be sent in responce so that we can make sure responce is ok
  // Post data will be sent in data key inside this object
  let object = {
  	status: 'ok',
  	data: imagesData,
  };
  
	// Finnaly sending prepared data in responce
  res.json(object);
});




// Function to get all the comments
router.get('/getcomments/:limit/:page/:postId', checkUserAuth, async (req, res) => {
	// Getting page number for pagination
	let page = Number(req.params.page) || 1;
	// Getting limit for pagination
	let limit = Number(req.params.limit) || 4;
	// calculating what number of post data will skip
	let skip = (page - 1) * limit;
	
  const user = await userModel.findOne({
		username: req.user.username,
	});
	let comment = await commentModel.find({
		postId: req.params.postId,
	}).skip(skip).limit(limit);
	
	// This will be sent in responce so that we can make sure responce is ok
  // Comment5 data will be sent in data key inside this object
  let object = {
  	status: 'ok',
  	data: comment,
  };
  
	// Finnaly sending prepared data in responce
  res.json(object);
});


module.exports = router;