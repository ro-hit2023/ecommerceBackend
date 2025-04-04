import {Schema, model} from "mongoose"

interface categoryData{
    name:[string];
    ar_name:string,
    lower_name:string;
    lower_ar_name:string;
    image:string;
    description:string;
    isActive:Boolean;
    isDelete:Boolean;
    uniqueId:string
}

const categorySchema = new Schema<categoryData>(
    {
        // name:{type:String, required:true},
        name:{type:[String], required:true},
        lower_name:{type:String, required:true},
        ar_name:{type:String, required:true},
        lower_ar_name:{type:String, required:true},
        image:{type:String,},
        uniqueId:{type:String, unique: true},
        description:{type:String},
        isActive:{type:Boolean, default:false},
        isDelete:{type:Boolean, default:false}
    },
    {
        timestamps:true,
        versionKey:false
    }
)

// single field indexing
// categorySchema.index({name:1})

// //compound indexing
// categorySchema.index({ar_name:1, lower_ar_name:1})

//multiKey indexing
// categorySchema.index({name:1})

//wild card indexing
categorySchema.index({"$**":1})



const categoryModel = model<categoryData>('category',categorySchema)
export default categoryModel

