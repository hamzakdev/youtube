const mongoose = require('mongoose')


const commentSchema = new mongoose.Schema({

    user:{
        type:String,
        required:true,
    },

    video:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:true,
    },

}, {timestamps:true})

module.exports = mongoose.model('Videos',commentSchema )