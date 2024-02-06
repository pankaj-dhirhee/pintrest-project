const mongoose = require('mongoose');


const postschema = new mongoose.Schema({
	boardName:{
		type: String,
	},
	
	imageText: {
		type: String,
		required: true,
	},
	
	image:{
		type: String,
	},
	
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user',
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},
	
	likes: {
		type: Number,
		default: 0
	},
	
	dislikes: {
		type: Number,
		default: 0
	},
	
	likedBy: [
	  {
	  	type: mongoose.Schema.Types.ObjectId,
	    	ref: "User",
	  }
  ],
	 
	dislikedBy: [
	  {
	  	type: mongoose.Schema.Types.ObjectId,
	  	 ref: "User",
	  }	
	],
	
	description: {
		type: String,
	}
});

module.exports = mongoose.model('Post', postschema);