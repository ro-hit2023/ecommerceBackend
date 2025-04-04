
import mongoose, { Schema, model } from "mongoose"

interface equipmentSpecification{
    equipmentId:String,
    keyId:String,
    keyValueId:String,
    keyType:String,
    keyValue:String,
    isDelete:boolean
}

const equipmentSpecification_Schema = new Schema<equipmentSpecification>({
     equipmentId:{type:mongoose.Types.ObjectId, ref:"equipment", required:true}, //I have taken mongoose id as it is _id from mongodb
     keyId:{type:mongoose.Types.ObjectId, ref:"catSpecification", required:true}, //I have taken mongoose id as it is _id from mongodb
     keyValueId:{type:mongoose.Types.ObjectId, ref:"catSpecificationValue", required:true}, //I have taken mongoose id as it is _id from mongodb
     keyType:{type:String, required:true},
     keyValue:{type:String, required:true},
     isDelete:{type:Boolean, default:false}
},
{
    timestamps:true,
    versionKey:false
})

const equipmentSpecificationModel =  model<equipmentSpecification>("equipmentSpecification", equipmentSpecification_Schema )


export default equipmentSpecificationModel