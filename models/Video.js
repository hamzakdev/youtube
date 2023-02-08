const mongoose = require('mongoose')


const videoSchema = new mongoose.Schema({

    user:{
        type:mongoose.Types.ObjectId,
        ref:'Users',
        required:true,
    },
    
    title:{
        type:String,
        required:[true, 'Please enter video title'],
    },
    
    desc:{
        type:String,
    },
    
    thumbnail:{
        type:String,
        required:[true, 'Please provide a thumbnail for your video'],
    },
    url:{
        type:String,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    tags:{
        type:[String],
        default:[]
    },
    likes:{
        type:[String],
        default:[]
    },
    dislikes:{
        type:[String],
        default:[]
    },
    

}, {timestamps:true})

module.exports = mongoose.model('Videos',videoSchema )