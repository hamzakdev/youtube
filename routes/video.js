const router = require('express').Router();
const asyncErrors = require('../middlewares/asyncErrors');
const verifyToken = require('../middlewares/token');
const User = require('../models/User');
const Video = require('../models/Video');
const ErrorHandler = require('../utilities/error');


// UPLOAD A NEW VIDEO

router.post('/',verifyToken, asyncErrors(async(req,res,next)=>{

        const video = await Video.create({
            ...req.body,
            user: req.user.id
            })
            res.status(200).json(video)


}))


// WATCH A VIDEO

router.get('/watch/:id', asyncErrors(async(req,res,next)=>{

    const video =await Video.findById(req.params.id).populate('user', '_id name subscribers profilePic subscriptions');
    if(!video) return next(new ErrorHandler('video not found', 404));

    //Increasing views

    await video.updateOne({
        $inc: {views: 1}
    });

    res.status(200).json(video)

}))



//Updating video's information


router.put('/update/:id', verifyToken, asyncErrors(async(req,res,next)=>{
    const {title, desc, tags, thumbnail} = req.body
    const video = await Video.findById(req.params.id)

    if(!video) return next(new ErrorHandler("video not found", 404));
    if(video.user !== req.user.id) return next(new ErrorHandler('video not found', 404))
    
    await video.updateOne({
        title,
        desc,
        tags,
        thumbnail
    },{
        runValidators:true,
        new:true
    });

    res.status(200).json('Video Updated')


}))

//deleting a video


router.delete('/delete/:id', verifyToken, asyncErrors(async(req,res,next)=>{
    const video = await Video.findById(req.params.id)

    if(!video) return next(new ErrorHandler("video not found", 404));
    if(video.user !== req.user.id) return next(new ErrorHandler('video not found', 404))
    
    await video.deleteOne()

    res.status(200).json('Video Deleted')


}))


//Fetching Random and searched videos

router.get('/videos', asyncErrors(async(req,res,next)=>{

    const videos = await Video.aggregate([{$sample:{size:40}}] )
    await Video.populate(videos, {path: 'user', select:'name profilePic'})

    res.status(200).json(videos)
}))


//Search Query

router.get('/results', asyncErrors(async(req,res,next)=>{
    const search = req.query.search_query

        const videos = await Video.find({
            title:{
                $regex:search,
                $options: "i"
            }
        }).populate("user", "_id name profilePic")

    res.status(200).json(videos)
}))




module.exports = router