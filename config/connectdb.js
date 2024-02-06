const mongoose = require("mongoose");

const connect_to_database = async () =>{
    const url = process.env.DATABASE_URL;
    mongoose.connect(url)
    .then(()=>{
    	console.log("Mongo db connected...")
    }).catch((err)=>{
    	console.log(err);
    }); 
}

module.exports = connect_to_database;