const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true, 'Please enter your first name'],
    },
 
    email:{
        type:String,
        required:[true, 'Please enter your email'],
        unique: [true, 'Email already exists']
    },
    password:{
        type:String,
        // minLength:[6,'Password must be atleast 6 characters'],
        // required:[true, 'Please enter your password'],
    },
    profilePic:{
        type:String,
    },
    subscribers:{
        type:Number,
        default:0
    },
    subscriptions:{
        type:[String],

    },

}, {timestamps:true})



//GENERATING HASHED PASSWORD

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

//COMPARING HASHED PASSWORD


module.exports = mongoose.model('Users',userSchema )