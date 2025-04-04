import express, { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import "express-async-errors"; //this helps to handle any unhandled Promise Rejcetion from controller and transfer them to global error handler for showing proper response on postman
import env from "dotenv";
import mongoose from "mongoose";
import { CustomError } from "./utils/error";
import { StatusCodes } from "http-status-codes";
import adminRoute from './routers/admin'
import status from "express-status-monitor"
import apiRoute from "./routers/index"
import { validatorJoiSchema_query } from "./utils/schemaValidators";
import { uploadImage_Schema } from "./Validators/commonValidator";
import { fileSizeCheck, upload } from "./utils/multer";
import multer from "multer";
import messages from "./custome_messages";
// import fs from "node:fs"


const app = express()
app.use(express.json())
env.config()
app.use(status())

//db connection
// mongoose.connect('mongodb://localhost:27017/Kart_clone');
  
//   const db = mongoose.connection;
//   db.on('error', console.error.bind(console, 'MongoDB connection error:'));
//   db.once('open', async () => {
//     console.log('Connected to MongoDB');
// });



// Replace <username>, <password>, and <cluster-url> with your MongoDB Atlas credentials
const atlasUri:any = process.env.MONGODB_URI;

mongoose.connect(atlasUri, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB Atlas');
});

//setting language in headers
app.use((req:any, res:any, next)=>{
  const lang = req.headers['language'] || 'en'
  req.language = lang;
  next()
})


// router and error handling

app.use('/api/v1/admin', adminRoute)

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => { // this is a global error handler which handles uncaught exceptions in whole project except try and cat
  if(err instanceof CustomError){
  const statusCode = err.HttpStatus || StatusCodes.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({
    error: err.message,
    message:err.message,
    code:err.HttpStatus
  });
}

res.status(err.HttpStatus || StatusCodes.INTERNAL_SERVER_ERROR).json({
  error: err.message,
  message:err.message,
  code:err.HttpStatus
})
res.status
});





// middle ware for handling image and video upload and handling error

const multerErrorHandler = (err:Error, req:Request, res:any, next:NextFunction)=>{
  if(err instanceof multer.MulterError){
    if(!req.file){
      return res.status(StatusCodes.EXPECTATION_FAILED).json({
        message:messages('en').ImageRequired,
        error:messages('en').ImageRequired,
        code:StatusCodes.EXPECTATION_FAILED
      })
    }
    if(err.code === "LIMIT_UNEXPECTED_FILE"){
      return res.status(StatusCodes.UNSUPPORTED_MEDIA_TYPE).json({
        message: messages('en').Unexpected_Feld_Name,
        error:"File name prefix must be Image",
        code:StatusCodes.BAD_REQUEST
      })
    }
    else if(err.code === "LIMIT_FILE_SIZE"){
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:"File size limit exceded",
        error:"Max file size should be 5 MB",
        code:StatusCodes.BAD_REQUEST
      })
    }
    else if(err.code === "LIMIT_FILE_COUNT"){
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:"File count limit exceded",
        error:"File count should be maximum 2",
        code:StatusCodes.BAD_REQUEST
      })
    }
      return res.status(StatusCodes.BAD_REQUEST).json({
        message:"Some thing went wrong",
        error:err.code,
        code:StatusCodes.BAD_REQUEST
      })
    }else if(err){
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message:"Internal Server Error",
        error:err,
        code:StatusCodes.INTERNAL_SERVER_ERROR
    })
  }
   next()
}

apiRoute.use('/upload', validatorJoiSchema_query(uploadImage_Schema), upload.fields([{name:'Image', maxCount:1}]), multerErrorHandler, fileSizeCheck) 




app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})

