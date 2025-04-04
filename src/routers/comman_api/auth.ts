import { Router } from "express";
import { StatusCodes } from "http-status-codes";

const authRoute = Router()


const { OK, CREATED }  = StatusCodes

export const a = {
    imageVideoUploaded:"/uploaded"
}

// authRoute.post(a.imageVideoUploaded, async(req, res){
//     const data = 
// } )

authRoute.post(a.imageVideoUploaded, async(req, res):Promise<any>=>{
    return res.json({message:"image or video uploaded", code:StatusCodes.ACCEPTED})
})


export default authRoute