const mongoose = require("mongoose");


const boardSchema = new mongoose.Schema({
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
	 	ref: 'User',
	},
	boardName: {
		type: String,
	},
	 posts:[{
	 	type: mongoose.Schema.Types.ObjectId,
	 	ref: 'Post',
	 	default: [],
	 }],
});

module.exports = mongoose.model("Board", boardSchema);
