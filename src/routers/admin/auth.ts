import {Router} from "express"
import user from "../../controllers/admin/auth"
import { StatusCodes } from "http-status-codes"
import {adminLoginSchema, adminValidator_Schema, changeAdminPassword} from "../../Validators/admin"
import  {validateJoiSchema} from "../../utils/schemaValidators"
import {checkRole, verifyToken}  from "../../helpers/verify";



const authRoute = Router()

const a = {
    login: "/login",
    signUp: "/adminSignUp",
    changePass:"/changePassword",
    logOut:"/logOut:id",
    forgetPass:"/forgetPass"
  
};

const { OK, CREATED } = StatusCodes

authRoute.post(a.signUp, validateJoiSchema(adminValidator_Schema), async(req, res)=>{
    const data = await user.signup(
        req?.body,
        req?.headers
    )
    res.status(CREATED).json({code: CREATED, data});
})

authRoute.post(a.login, validateJoiSchema(adminLoginSchema), async(req, res)=>{
    const data = await user.login(
        req.body,
        req.headers
    )
    res.status(OK).json({code:OK,data})
})


authRoute.patch(a.changePass,verifyToken, validateJoiSchema(changeAdminPassword), checkRole(["admin"]), async(req, res)=>{
    const data = await user.changeAdminPassword(
        req, res
    )
    res.status(OK).json({code:OK, data})
} )

authRoute.delete(a.logOut, verifyToken, checkRole(["admin"]), async(req, res)=>{
     const data = await user.LogOut(
        req, res
     )
     res.status(OK).json({code:OK, data})
})

authRoute.patch(a.forgetPass, verifyToken, checkRole(["admin"]), async(req, res)=>{
    const data = await user.forgetAdminPass(
        req.body,
        req.headers
    )
    res.status(OK).json({code:OK, data})
})



export default authRoute




