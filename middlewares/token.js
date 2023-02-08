const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utilities/error');
const User = require('../models/User');
const asyncErrors = require('./asyncErrors');


const verifyToken = asyncErrors(async(req,res,next) =>{
    const token = req.cookies.token;
    if(!token) return next(new ErrorHandler('Authentication error', 401) );

   const data =  jwt.verify(token, process.env.JWT_KEY);
   req.user =await User.findById(data.id);
   next();
});

module.exports = verifyToken