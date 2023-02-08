const express = require('express');
const app = express();
const dotenv = require('dotenv').config()
const  connectDb  = require('./db');
const ErrorMiddleware = require('./middlewares/error')
const AsyncErrorsMiddleware = require('./middlewares/asyncErrors');
const userRoute = require('./routes/user')
const authRoute = require('./routes/authentication');
const videoRoute = require('./routes/video');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path')



//Middlewares

app.use(express.json())
app.use(cookieParser())
// app.use(cors({origin:'https://fir-1ffa2.web.app', credentials:true}))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type', 'Access-Control-Allow-Origin', 'Origin');
  res.setHeader('Access-Control-Allow-Credentials', true);

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  next();
});





//CONNECTING DATABASE AND LISTENING TO THE SERVER
connectDb().then(app.listen(5000, ()=>{
    console.log('server started')
}))

app.get('/', (req,res)=>{
    app.use(express.static(path.resolve(__dirname,'client','build')))
    res.sendFile(path.resolve(__dirname,'frontend','build','index.html'))
})
app.use('/user', userRoute)
app.use('/auth', authRoute)
app.use('/video', videoRoute)

//ERROR HANDLING

app.use(ErrorMiddleware)
app.use(AsyncErrorsMiddleware)



