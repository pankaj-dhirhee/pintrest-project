const express = require('express');
const router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require("passport");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
const upload = require("./multer")
const fs = require("fs");
const path = require('path')


// Rendering sign in page 
router.get('/', function(req, res, next) {
  res.render('index');
});


//Rendering login page 
router.get("/login", async function(req, res, next){
	res.render('login', {error: req.flash('error')});
}); 


// Rendering profile page
router.get("/profile", isLoggedIn, async function(req, res, next){
	const user = await userModel.findOne({
		 username: req.session.passport.user
	})
	.populate("posts")
	console.log(user);
	res.render("profile", {user});
});


//Rendering feed page
router.get('/feed', isLoggedIn, async (req, res, next)=>{
	const user = await userModel.findOne({
		username: req.session.passport.user,
	})
  let posts = await postModel.find().limit(15);
  res.render('feed', {user, posts});
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
router.get('/username/:username', async (req, res)=>{
	let regex = new RegExp(`${req.params.username}`, 'i');
	const users = await postModel.find({
		imageText: regex,
	});
	console.log(users)
	res.json(users);
});


// Dispaly post image detail in specific page
router.get('/preview/:user_obj_id', isLoggedIn, async (req, res)=>{
	let post = await postModel.findOne({
		 image: req.params.user_obj_id,
	});
	let user = await userModel.findOne({
		 username: req.session.passport.user
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
	res.render('preview', {post: post, user: user, liked: isLiked, disliked: isDisliked});
});
// Its's ending


//Route to upload image files
router.post("/upload", isLoggedIn, upload.single("file"), async function(req, res, next){
	if(!req.file){
	  	return res.status(404).send(" no file were given");
	}
	const user = await userModel.findOne({
		 username: req.session.passport.user
	});
	const post = await postModel.create({
		 image: req.file.filename,
		 imageText: req.body.filecaption,
		 description: req.body.description,
		 user: user._id
	});
	user.posts.push(post._id);
	await user.save();
	res.redirect("/profile");
});


//Uploading profile image & deleting provious profile image
router.post('/fileupload/:imgurl', isLoggedIn, upload.single("image"), async function(req, res, next){
	const user = await userModel.findOne({username: req.session.passport.user});
	let imageUrl = req.params.imgurl;
	
	// If profile image is already in uplods folder then delete it
	if(user.profileImage != 'noProfileImage'){
	   fs.unlink(path.join(__dirname, '..', 'public', 'images', 'uploads', `${imageUrl}`), function(err){
		    if(err) throw err;
	   });
	}
	
	// Store url of profile image to database
	user.profileImage = req.file.filename;
	await user.save();
	res.redirect('/profile')
});


//Route to create new account
router.post("/register", function(req, res){
	const {username, email, fullname} = req.body;
	const userData = new userModel({username, email, fullname});
	userModel.register(userData, req.body.password)
	.then(function(){
		  passport.authenticate("local")(req, res, function(){
		     res.redirect('/profile');
	    });
	});
});


//Route to login account
router.post("/login", passport.authenticate("local", {
	successRedirect: "/profile",
	failureRedirect: "/login",
	failureFlash: true
}), function(req, res){  });


//Route to logout account
router.get("/logout", function(req, res){
	req.logout(function(err){
		if (err) { return next(err); }
		res.redirect('/');
	});
});


// Route to delete iamges on click og delete button
router.get('/deleteimage/:imageurl', async (req, res)=>{
	let imageUrl = req.params.imageurl;
	
	// Delete image url from database
	await postModel.deleteOne({
		image: imageUrl,
	});
	
	// Delete file from uploads folder
	fs.unlink(path.join(
	__dirname, '..', 'public', 'images', 'uploads', `${imageUrl}`), function(err){
		if(err) throw err;
	});
  res.redirect(req.get('referer'))
});


//Show all pins of user in specific page
router.get('/show', isLoggedIn, async (req, res, next)=>{
	const user = await userModel.findOne({
		 username: req.session.passport.user,
	})
	.populate("posts");
	res.render("imgshow", {user});
});


// Route to download image on click of download button 
router.get('/download/:image_url', (req, res)=>{
	const file = path.join(__dirname, '..', 'public', 'images', 'uploads', `${req.params.image_url}`);
  res.download(file); // Set disposition and send it.
});


//Function to ckeck if user is authenticated
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()) return next();
	res.redirect("/login");
};

module.exports = router;