import mongoose, {Schema, model} from "mongoose"

 interface catSpecification{
    categoryId:String,
    keyName:String,
    ar_keyName:String,
    lower_keyName:String,
    lower_ar_keyName:String,
    isDelete:Boolean,
    type:String
 }

 const catSpecification_Schema = new Schema<catSpecification>(
 {
    categoryId:{type:mongoose.Types.ObjectId, ref:"category", required:true},
    keyName:{type:String, required:true},
    ar_keyName:{type:String, required:true},
    lower_keyName:{type:String, required:true},
    lower_ar_keyName:{type:String, required:true},
    isDelete:{type:Boolean},
    type:{type:String, required:true}
 },
 {
    timestamps:true,
    versionKey:false
 })

const catSpecificationModel = model<catSpecification>('catSpecification',catSpecification_Schema)
export default catSpecificationModel


