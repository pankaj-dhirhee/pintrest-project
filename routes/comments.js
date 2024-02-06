const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
	content: {
		type: String,
		required: true,
	},
	postId: {
		type: mongoose.Schema.Types.ObjectId,
    ref: "User",
	},
	createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
	},
	profileImage: {
		type: String,
	},
	username: {
		type: String,
	}
});

module.exports = mongoose.model("Comment", commentSchema);