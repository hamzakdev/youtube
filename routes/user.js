const router = require('express').Router();
const asyncErrors = require('../middlewares/asyncErrors');
const verifyToken = require('../middlewares/token');
const User = require('../models/User');
const ErrorHandler = require('../utilities/error');

//get a user

router.get('/', verifyToken, asyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    
    if(!user) return next(new ErrorHandler('user not found', 404));

    const {password, ...others} = user._doc
    res.status(200).json(others)
    
}))
//get a user

router.get('/channel/:id', asyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user) return next(new ErrorHandler('user not found', 404));
    const {password, ...others} = user._doc
    res.status(200).json(others)
    
}))


//subscribe and unsubscribing a user

router.put('/subscribe/:id', verifyToken, asyncErrors(async(req,res,next)=>{

    //Finding my account
    const me = await User.findById(req.user.id);

    
    //Finding account of the person I am trying to subscribe
    
    const subbedUser = await User.findById(req.params.id) 
    
    //Throwing error if person I am trying to subscribe does not exist

    if (!subbedUser) return next(new ErrorHandler('user not found'), 404);

   

    //Making sure I don't subscribe myself

    if(req.user.id === req.params.id) return next(new ErrorHandler('You cant subscribe to yourself'))


 if(me.subscriptions.includes(subbedUser._id)){
   // UnSubscribing 
     
   await subbedUser.updateOne({
    $inc: {subscribers: -1}
   })
   
   // Removing subscribed person from my subscriptions
   me.subscriptions.pull(req.params.id)
await me.save();

res.json(false)

}

else{
    
    // Subscribing
    
    await subbedUser.updateOne({
        $inc: {subscribers: 1}
    })
    
    // Adding subscribed person to my subscriptions
    me.subscriptions.push(req.params.id)
    await me.save();
    
    res.json(true)
    }


    
}))


module.exports = router