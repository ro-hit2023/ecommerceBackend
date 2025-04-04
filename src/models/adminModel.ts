import {Schema, model} from "mongoose"
import bcrypt from "bcrypt"

interface admin_Data  {
    firstName: string;
    lastName: string;
    userName: string;
    email:string;
    hashPassword:string;
    role:string;
    contact:string;
    profile:string;
    token:string;
    isDelete: boolean;
    isActive:boolean; 
}

const adminSchema = new Schema<admin_Data>(
    {
        userName:{type:String, required:true},
        email:{type:String, required:true},
        hashPassword:{type:String, required:true },
        role: {type: String, enum:['user','admin'], default:'admin'},
        contact:{type:String},
        profile:{type:String},
        token:{type:String},
        isDelete:{type:Boolean, default:false },
        isActive:{type:Boolean, default:true}
    },
    {
        timestamps:true,
        versionKey: false 
    }
)

adminSchema.index({userName:1, email:1, contact:1})




const adminModel = model<admin_Data>('admin',adminSchema)
export default adminModel