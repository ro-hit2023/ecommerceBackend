import { timeStamp } from "console"
import mongoose, { Schema, model } from "mongoose"

interface catSpecificationValue_Schema{
    categoryId:String,
    keyId:String,
    keyValue:String,
    lower_keyValue:String,
    ar_keyValue:String,
    lower_ar_keyValue:String,
    isDelete:boolean
}

const catSpecification_Schema = new Schema<catSpecificationValue_Schema>({
     categoryId:{type:mongoose.Types.ObjectId, ref:"category", required:true},
     keyId:{type:mongoose.Types.ObjectId, ref:"catSpecification", required:true},
     keyValue:{type:String, required:true},
     lower_keyValue:{type:String, required:true},
     ar_keyValue:{type:String, required:true},
     lower_ar_keyValue:{type:String, required:true},
     isDelete:{type:Boolean, default:false}
},
{
    timestamps:true,
    versionKey:false
})

const catSpecificationValueModal = model<catSpecificationValue_Schema>("catSpecificationValue", catSpecification_Schema)

export default catSpecificationValueModal
