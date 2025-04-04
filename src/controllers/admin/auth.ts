import { StatusCodes } from "http-status-codes";
import  messages  from "../../custome_messages";
import adminModel from "../../models/adminModel"
import { CustomError } from "../../utils/error"
import argon2 from "argon2"
import * as jwt from 'jsonwebtoken'; 


function signup(body:any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { language  } = headers;
            const message = messages(language);
            const { userName, email, contact, password } = body;
            body.lower_userName = body.userName.toLowerCase()
            const check = await adminModel.findOne({
                isDelete: false,
                email: { '$regex': email, '$options': 'i' }
            });
            if (check) {             
                reject(
                   new CustomError(message.UserAlreadyExists, StatusCodes.BAD_REQUEST)
                );
            } else {
                body.hashPassword = await argon2.hash(password)
                const data = await adminModel.create(body,{hashPassword:0});
                resolve(data);
            }
        } catch (error) {
            reject(error);
            
        }
    });
}


function login(body:any, headers:any):Promise<any>{
    return new Promise (async (resolve, reject)=>{
        const { language = 'en'} = headers;
        const message = messages(language)
        try{
            const { email, password } = body
            const check = await adminModel.findOne({
                email:email
            })
            if(check){
                const verifyPassword = await argon2.verify(
                    `${check.hashPassword}`,
                    password
                )
                if(verifyPassword){
                    const secret = process.env.JWT_SECRET_TOKEN;
               
                    if (!secret) {                        
                           reject(new CustomError(message.InvalidToken, StatusCodes.BAD_REQUEST))
                           return
                         }                 
                    const access_token = await jwt.sign(
                        {id:check._id, role:"admin"},
                        secret,
                        {
                            expiresIn: "2d"
                        }
                    )                    
                    const update = await adminModel.findOneAndUpdate(
                        { email:check.email },
                        { token:access_token },
                        { 
                            new: true,  
                            projection: {  
                                hashPassword: 0, 
                                role: 0, 
                                isDelete: 0, 
                                isActive: 0, 
                                createdAt: 0, 
                                updatedAt: 0 
                            }
                        }
                    )
                    resolve(
                        update
                      );
                      
                }else{
                    reject(new CustomError(message.WrongPassword, StatusCodes.BAD_REQUEST))
                }   
            }else{
                reject(new CustomError(message.AccountDoesNotExist, StatusCodes.BAD_REQUEST))
            }

        }catch(error){
            reject(error)
        }
    })
}

async function changeAdminPassword(req:any, res:any):Promise<any>{
    const language = req.headers.language || 'en'
    const message = messages(language)
    try{
        const oldPass = req.body.oldPass
        const newPass = req.body.newPass
        if(oldPass !== newPass){
            const existingAdmin = await adminModel.findOne()          
            if(existingAdmin){
                const verifyPassword = await argon2.verify(
                    `${existingAdmin.hashPassword}`,
                    oldPass
                )
                if(!verifyPassword){
                    return res.json({message:message.PasswordDoesNotMatch, code:StatusCodes.BAD_REQUEST})
                }else{
                    const hashPassword = await argon2.hash(newPass)
                    const updatePass = await adminModel.updateOne({_id:existingAdmin._id}, {hashPassword:hashPassword})
                    return res.json({message:message.PasswordChangedSuccessfully, code:StatusCodes.CREATED, result:updatePass})
                }
            }else{
                return res.json({message:message.AdminWithGivenPasswordNotExist, code:StatusCodes.BAD_GATEWAY})
            }
        }else{
            return res.json({message:message.AccountDoesNotExist, code:StatusCodes.NOT_FOUND})
        }
    }catch(error){
        return res.json({message:message.ServerError, code:StatusCodes.INTERNAL_SERVER_ERROR})
    }  
}

async function LogOut(req:any, res:any):Promise<any>{
    const language = req.headers.language || 'en'
    const message = messages(language)
    try{
        const update = await adminModel.updateOne({_id:req.params.id},{isDelete:true})
        if(update){
            return res.json({message:message.AdminDeletedSuccessfully, result:update})
        }else{
        return res.json({message:message.NoAdminExistWithThisId, code:StatusCodes.BAD_REQUEST})
        }
    }catch(error){
        return res.json({message:message.ServerError, code:StatusCodes.INTERNAL_SERVER_ERROR})
    }
}

function forgetAdminPass(body:any, headers:any){
    return new Promise(async(resolve, reject)=>{
        const language = headers.language || 'en'
        const message = messages(language)
        try{
            const { email, password, confirmPassword } = body
            const findByEmail = await adminModel.findOne({email:email})
            if(!findByEmail){
                reject(new CustomError(message.NoAccountMatch, StatusCodes.NOT_FOUND ))
            }else{
                if(password === confirmPassword){
                    const hashPassword = await argon2.hash(password)
                    const updatepass = await adminModel.updateOne({_id:findByEmail._id},{hashPassword:hashPassword})
                    resolve(message.PasswordUpdateSuccessFull)
                }else{
                    reject(new CustomError(message.PasswordDoesNotMatch, StatusCodes.NOT_ACCEPTABLE))
                }
            }
        }catch(error){
            reject(error)
        }
    })
}

// async function forgetAdminPass(req:any, res:any){
//         const language = req.headers.language || 'en'
//         const message = messages(language)
//         try{
//             const { email, password, confirmPassword } = req.body
//             const findByEmail = await adminModel.findOne({email:email})
//             if(!findByEmail){
//                 // reject(new CustomError(message.NoAccountMatch, StatusCodes.NOT_FOUND ))
//                 return res.json({message:message.NoAccountMatch, code:StatusCodes.NOT_FOUND})
//             }else{
//                 if(password === confirmPassword){
//                     const hashPassword = await argon2.hash(password)
//                     const updatepass = await adminModel.updateOne({_id:findByEmail._id},{hashPassword:hashPassword})
//                     return res.json({message:message.PasswordUpdateSuccessFull, code:StatusCodes.ACCEPTED})
//                 }else{
//                     // reject(new CustomError(message.PasswordDoesNotMatch, StatusCodes.NOT_ACCEPTABLE))
//                     return res.json({message:message.PasswordDoesNotMatch, code:StatusCodes.BAD_REQUEST})
//                 }
//             }
//         }catch(error){
//             return res.json({message:message.ServerError, code:StatusCodes.INTERNAL_SERVER_ERROR})
//         }
// }




export default {
    signup,
    login,
    changeAdminPassword,
    LogOut,
    forgetAdminPass
} as const


