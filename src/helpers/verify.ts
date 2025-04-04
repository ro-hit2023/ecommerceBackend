import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken"
import messages from "../custome_messages";
import { CustomError } from "../utils/error";


 const verifyToken = function(req:any, res:Response, next:NextFunction):void{
    const token = req.headers.authorization
    const language = req.headers.language ? req.headers.language:'en'
    const message = messages(language)
    if(!token){
         res.status(StatusCodes.UNAUTHORIZED).json({
            error: message.TokenNotAvalible,
            message:message.TokenNotAvalible,
            code:StatusCodes.UNAUTHORIZED
        })
        return
    }
    else{
        try{
        const secret = process.env.JWT_SECRET_TOKEN
       
        if(!secret){
            res.status(StatusCodes.UNAUTHORIZED).json({
            error:message.InvalidToken,
            message:message.InvalidToken,
            code:StatusCodes.UNAUTHORIZED
           })
           return
        }
        const verifide = jwt.verify(token, secret) as JwtPayload
        if(verifide.role == 'admin'){
            req.user = verifide;
            next()
            return
        } 
    }catch(err){
     res.status(StatusCodes.UNAUTHORIZED).json({
        error:message.InvalidToken,
        message:message.InvalidToken,
        code:StatusCodes.BAD_REQUEST
       })
       return
    }
   }
}

const checkRole = (role:string[])=>{
    return (req:any, res:Response, next:NextFunction)=>{
         const lauguage = req.headers.language ? req.headers.language:'en'
         const message = messages(lauguage)
         if(role.includes(req.user.role)){
            next()
         }else{
            res.status(StatusCodes.UNAUTHORIZED).json({
                error:message.InvalidRole,
                message:message.InvalidRole,
                code:StatusCodes.FORBIDDEN
            })
         }

    }   
}

export {
    verifyToken,
    checkRole
    }

