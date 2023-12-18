const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const url = 'mongodb+srv://dhirheepankaj:dhirhee_mongodb@cluster0.g9il8qo.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(url)
.then(()=>{
	console.log("Mongo db connected...")
}).catch((err)=>{
	console.log(err);
});

const userSchema = new mongoose.Schema({
	 username:{
	 	 type: String,
	 	 required: true,
	 	 unique: true,
	 },
	 password:{
	 	 type: String,
	 },
	 profileImage: {
	 	 type: String,
	 	 default: 'noProfileImage'
	 },
	 posts:[{
	 	type: mongoose.Schema.Types.ObjectId,
	 	ref: 'Post',
	 }],
	 email: {
	 	 type: String,
	 	 required: true,
	 },
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
userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);
