const router = require('express').Router();
const User = require('../models/User')
const asyncErrors = require('../middlewares/asyncErrors');
const ErrorHandler = require('../utilities/error');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')



//REGISTER A NEW USER
router.post('/register',asyncErrors(async(req,res,next)=>{
   
    const user = await User.create(req.body)
    const token = jwt.sign({id:user._id}, process.env.JWT_KEY)
    const options = {
        httpOnly : true,
        expires: new Date(Date.now() + 86400000 * 5),
    }
    res
    .status(200)
    .cookie("token", token, options)
    .json({success:true, message:'REGISTERED'})


}))
//GOOGLE AUTH
router.post('/google',asyncErrors(async(req,res,next)=>{
   
    const user = await User.findOne({email: req.body.email})
    if(user){
    const token = jwt.sign({id:user._id}, process.env.JWT_KEY)
        const options = {
            httpOnly : true,
            expires: new Date(Date.now() + 86400000 * 5),
        }
        res
        .status(200)
        .cookie("token", token, options)
        .json({success:true, message:'Login'})

    }
    else{
        const newUser = await User.create({
            ...req.body
        })

        const token = jwt.sign({id:newUser._id}, process.env.JWT_KEY)
        const options = {
            httpOnly : true,
            expires: new Date(Date.now() + 86400000 * 5),
        }
        res
        .status(200)
        .cookie("token", token, options)
        .json({success:true, message:'REGISTERED'})

    }

}))

//LOGIN A USER
router.post('/login',asyncErrors(async(req,res,next)=>{
    const {email, password} = req.body
    const user = await User.findOne({email})
    if(!user)return next(new ErrorHandler('Wrong Credentials',401))

    const comparedPassword = await bcrypt.compare(password, user.password)
    if(!comparedPassword)return next(new ErrorHandler('Wrong Credentials', 401))

    const token = jwt.sign({id:user._id}, process.env.JWT_KEY)
    const options = {
        expires: new Date(Date.now() + 86400000 * 5),
    }
    res.cookie("token", token, options);
      res.json('Logged In')
}))




module.exports = router