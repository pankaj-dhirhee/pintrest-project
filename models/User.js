const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		trim: true
	},
	password:{
		type: String,
		required: true,
		trim: true,
	},
	isEmailAuthenticated:{
	  type: Boolean,
	  default: false
	},
	profileImage: {
	 	 type: String,
	 	 default: 'blue-backgroung.jpeg'
	},
	posts:[{
	 	type: mongoose.Schema.Types.ObjectId,
	 	ref: 'Post',
	}],
	fullname: {
	 	 type: String,
	 	 required: true,
	},
	contact: {
	 	type: Number,
	},
	boards: {
	 	 type: Array,
	 	 default: [],
	},
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;