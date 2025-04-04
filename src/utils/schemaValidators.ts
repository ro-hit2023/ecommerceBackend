import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";


//middle ware require 3 parameters only
const validateJoiSchema = (schema:any) => {
  return (req: Request, res: Response, next: NextFunction)=> {
    const  {error}  = schema.validate(req.body)
    if (!error) {
      next(); 
    }else{
    const message = error.details
      .map((detail: any) => detail.message.split('"').join(""))
      .join(",");
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      error: message,
      message: message,
      code: StatusCodes.UNPROCESSABLE_ENTITY,
    });
  }
  return;
  };
};

const validatorJoiSchema_query = (schema:any)=>{
  return (req:Request, res:Response, next: NextFunction)=>{
    const {error} = schema.validate(req.query)
    if(!error){
      next();
    }else{
      const message = error.details.map((i:any)=> i.message.split('"').join("")).join(",")
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        error:message,
        message:message,
        code:StatusCodes.UNPROCESSABLE_ENTITY
      });
    }
    return;
  }
}


  export { validateJoiSchema, validatorJoiSchema_query }



  