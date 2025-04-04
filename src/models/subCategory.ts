import { ref } from "joi";
import mongoose, {Schema, model} from "mongoose"

interface subCategoryData{
    categoryId:any,
    uniqueSubId:String;
    name:String;
    lower_name:String;
    ar_name:String;
    lower_ar_name:String;
    image:String;
    description:String;
    isActive:Boolean;
    isDelete:Boolean
}

const subCategorySchema = new Schema<subCategoryData>(
    {   
        categoryId:{type:mongoose.Types.ObjectId, ref:'category'},
        uniqueSubId:{type:String, required:true},
        name:{type:String, required:true },
        lower_name:{type:String, required:true},
        ar_name:{type:String, required:true},
        lower_ar_name:{type:String, required:true},
        image:{type:String},
        description:{type:String},
        isActive:{type:Boolean, default:false},
        isDelete:{type:Boolean, default:false}
    },
    {
        timestamps:true,
        versionKey:false
    }
)

subCategorySchema.index({name:1, lower_name:1})

const subCategoryModel = model<subCategoryData>('subCategory',subCategorySchema)
export default subCategoryModel

