import express, { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import "express-async-errors"; //this helps to handle any unhandled Promise Rejcetion from controller and transfer them to global error handler for showing proper response on postman
import env from "dotenv";
import mongoose from "mongoose";
import { CustomError } from "./src/utils/error";
import { StatusCodes } from "http-status-codes";
import adminRoute from './src/routers/admin'
import status from "express-status-monitor"
import apiRoute from "./src/routers/index"
import { validatorJoiSchema_query } from "./src/utils/schemaValidators";
import { uploadImage_Schema } from "./src/Validators/commonValidator";
import { fileSizeCheck, upload } from "./src/utils/multer";
import multer from "multer";
import messages from "./src/custome_messages";
import path from "path";
// import fs from "node:fs"

const app = express()
app.use(express.json())
env.config()
app.use(status())

app.use(express.static(path.join(__dirname + '/public')));


//---------------------UI--------------------------------//

//Public----
app.get('/vendoradd', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/vendoradd.html'));
});
// login addmin
app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/login.html'));
});
//vendor listing
app.get('/vendor', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/allvendor.html'));
});
//vendor view
app.get('/vendorView', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/vendorView.html'));
});
//user view
app.get('/userView', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/userView.html'));
});
// vendor edit
app.get('/vendoredit', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/vendoredit.html'));
});
// User Edit
app.get('/useredit', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/useredit.html'));
});
//User listing
app.get('/user', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/user.html'));
});
//category listing
app.get('/categories', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/categories.html'));
});
// menu Listing
app.get('/menu', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/menu.html'));
});
//add menu
app.get('/addmenu', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/menuAdd.html'));
});
// add categories
app.get('/addcategory', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/categoriesAdd.html'));
});
// offer listing
app.get('/offers', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/OfferListing.html'));
});
//banner list
app.get('/bannerList', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/bannerList.html'));
});
//add banner
app.get('/addbanner', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/addbanner.html'));
});
//edit banner
app.get('/editBanner', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/editBanner.html'));
});
//notification single
app.get('/singleNotification', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/singleNotification.html'));
});
//bulk notofication
app.get('/bulkNotification', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/bulkNotification.html'));
});
//Add On
app.get('/AddonListing', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/AddonListing.html'));
});
// FAQs
app.get('/FA', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/Faq.html'));
});
app.get('/addOffers', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/addOffer.html'));
});
app.get('/sizeListing', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/sizeListing.html'));
});
app.get('/dashboard', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/dashboard.html'));
});
app.get('/app_version', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/app_version.html'));
});
app.get('/settings', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/changepassword.html'));
});
// FAQs
app.get('/FAQs', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/Faq.html'));
});
app.get('/addFAQ', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/addFAQ.html'));
});
app.get('/EditFaq', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/editFaq.html'));
});
app.get('/termAndCondition', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/pizzaNpints_termAndCondition.html'));
});

app.get('/privacy', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/pizzaNpints_privacy.html'));
});
app.get('/complaints', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/complaints.html'));
});
//report Details
app.get('/reportDetails', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/reportDetails.html'));
});
//Order Inprogress
app.get('/orderProgress', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/orderProgress.html'));
});
app.get('/orderComplete', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/orderComplete.html'));
});
app.get('/orderCancel', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/orderCancel.html'));
});
app.get('/orderDetails', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/orderDetail.html'));
});
app.get('/review', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/review.html'));
});
app.get('/addonCategory', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/addonCategory.html'));
});
app.get('/vendortime', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/vendortime.html'));

});
app.get('/vendorEmployee', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/vendorEmployee.html'));
});
app.get('/vendorGallery', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/vendorGallery.html'));
});
app.get('/branch', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/branch.html'));
});
app.get('/orderPending', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/orderPending.html'));
});
app.get('/newCategoryadd', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/newCategoryadd.html'));
});
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/test.html'));
});



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

