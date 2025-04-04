import { required } from "joi";
import mongoose, { Schema, model } from "mongoose";

interface subsubCategoryData{
    categoryId:any,
    subCategoryId:any,
    uniqueSubSubId:String,
    name:string,
    ar_name:string,
    lower_name:string,
    lower_ar_name:string,
    isActive:boolean,
    isDelete:boolean
}

const subsubCategorySchema = new Schema<subsubCategoryData>({
    categoryId:{type:mongoose.Types.ObjectId, ref:'category', required:true},
    subCategoryId:{type:mongoose.Types.ObjectId, ref:'subCategory', required:true},
    uniqueSubSubId:{type:String, required:true},
    name:{type:String, required:true},
    ar_name:{type:String, required:true},
    lower_name:{type:String, required:true},
    lower_ar_name:{type:String, required:true},
    isActive:{type:Boolean, default:false},
    isDelete:{type:Boolean, default:false}
},
{
    timestamps:true,
    versionKey:false
}
)


const subsubCategoryModel = model<subsubCategoryData>('subsubCategory', subsubCategorySchema)

export default subsubCategoryModel;





