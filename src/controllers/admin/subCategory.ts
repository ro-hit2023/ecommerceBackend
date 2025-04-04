import { StatusCodes } from "http-status-codes"
import messages from "../../custome_messages"
import subCategoryModel from "../../models/subCategory"
import { CustomError } from "../../utils/error"
import { identityGenerator } from "../../helpers/helpers"
import { count } from "console"
import mongoose from "mongoose"
import subsubCategoryModel from "../../models/subsubCategory"


function addSubCategory(body:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
        const language = headers.language ? headers.language : 'en'
        const message = messages(language)
        try{
            body.lower_name = body.name.toLowerCase()
            body.lower_ar_name = body.ar_name.toLowerCase()
            const count = await subCategoryModel.countDocuments()
            const uniqueSubId = identityGenerator('adminSubCategory', count)
            console.log(uniqueSubId)
            const check = await subCategoryModel.findOne({
                $or:[
                    {
                        isDelete:false,
                        lower_name:body.lower_name,
                        categoryId:body.categoryId
                    },
                    {
                        isDelete:false,
                        lower_ar_name:body.lower_ar_name,
                        categoryId:body.categoryId
                    }
                ]
            })
            console.log(check)
            if(check){
                reject (new CustomError(message.SubCategoryAlreadyExists.replace("{{SubCategory}}", `${body.name}`), StatusCodes.BAD_REQUEST))
            }else{
                body.uniqueSubId  = uniqueSubId
                const createCat = await subCategoryModel.create(body)
                if(createCat){
                    resolve(createCat)
                }
            }
        }catch(error){
            reject(error)
        }
    })
}



function editSubCategory(body:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
        const language = headers.language ? headers.language : 'en'
        const message = messages(language)
        const session = await mongoose.startSession()
        await session.startTransaction()
        try{
            const { id, isActive, categoryId } = body
            console.log(id)
            body.lower_name = body.name.toLowerCase()
            body.lower_ar_name = body.ar_name.toLowerCase()
            const find = await subCategoryModel.findOne({
                $or:[
                    {
                        isDelete:false,
                        lower_name:body.lower_name,
                        categoryId:categoryId
                    },
                    {
                        isDelete:false,
                        lower_ar_name:body.ar_name,
                        categoryId:categoryId
                    }
                ],
                _id:{
                    $ne:id
                }
            })
            console.log(find)
            if(!find){
                const update = await subCategoryModel.findByIdAndUpdate(
                    {_id:id},
                     body, 
                    {new:true, projection: {lower_name:0, lower_ar_name:0, isDelete:0, createdAt:0,updatedAt:0, __v:0, uniqueSubId:0}});
                  await subsubCategoryModel.updateMany(
                    {subCategoryId:id, isDelete:false},
                    {
                      isActive:isActive
                    },
                    {
                        session,
                        new:true
                    }
                )
                await session.commitTransaction()
                resolve({sucess:true})
            }else{               
                reject(new CustomError(message.SubCategoryAlreadyExists.replace("{{subCategory}}",`${body.name} OR ${body.ar_name}`), StatusCodes.NOT_FOUND))
            }
        }catch(error){
            await session.abortTransaction()
            reject(error)
        }finally{
            await session.endSession()
        }
    })
}

function listSubCategory(query:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
         const language = headers.language ? headers.language: 'en'
         const message = messages(language)
        try{
         
            const { search, isActive, page, perPage, categoryId } = query
            const page1 = parseInt(page) || 1
            const perPage1 = parseInt(perPage) || 10
            const skip = (page1-1)*perPage1
            var obj:any = {isDelete:false, categoryId:new mongoose.Types.ObjectId(categoryId)}

            if(search){
            obj = {
                ...obj,
                $or:[
                    {name:{$regex:search, $options:"i"}},
                    {ar_name:{$regex:search, $options:"i"}},
                    {uniqueSubId:{$regex:search, $options:"i"}}
                ]
               }
            }
        if(isActive === "active"){
            obj.isActive = true
        }else if(isActive === "Inactive"){
            obj.isActive = false
        }else if(isActive === "all"){
            obj.isActive = {$in:[true, false]}
        }
        console.log(obj)
        
        const [list, TotalCount] = await Promise.all([subCategoryModel.aggregate([
            {
                $match:obj
            },
            {
                $lookup:{
                    from:"subsubcategories",
                    let:{subCategoryId:"$_id"},
                    pipeline:[
                        {
                            $match:{
                                $expr:{
                                    $and:[
                                        {$eq:["$subCategoryId","$$subCategoryId"]},
                                        {$eq:["$isDelete", false]}
                                    ]
                                }
                            }
                        },
                        {
                            $project:{   
                                categoryId: 0,
                                subCategoryId: 0,
                                uniqueSubSubId: 0,
                                lower_name: 0,
                                lower_ar_name: 0,
                                isDelete: 0,
                                __v: 0
                            }
                        }
                    ],
                    as:"subsubCategoryData"
                }
            },    
            {
                $project:{    
                     categoryId: 1,
                     uniqueSubId: 1,
                     name: 1,
                     lower_name:1,
                     ar_name: 1,
                     lower_ar_name: 1,
                     isActive:1,
                     isDelete:1,
                     subsubCategoryCount:{$size:"$subsubCategoryData"}
                }
            },
            {$sort:{createdAt:-1}},
            {
                $facet:{
                    count:[{$count: "total"}],
                    document:[{$skip:skip},{$limit:perPage1}]
                }
            },
        ]),
          await subCategoryModel.countDocuments(obj)
    ])  
    // const count = list[0].count.length>0 ? list[0].count[0].total:0
    // const document1 = list[0].document?list[0].document:{}
    // resolve({document1, count, TotalCount})
    resolve({list, TotalCount})
        }catch(error){
            reject(error) 
        }
    })
}


function deleteSubCategory(params:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
        const language = headers.language ? headers.language: 'en'
         const message = messages(language)
        try{
            const { id } = params 
            const deleteSubCat = await subCategoryModel.updateOne({_id:id}, {isDelete:true})
            console.log(deleteSubCat)
            if(deleteSubCat.modifiedCount === 1){
                resolve({success:true})
            }else{
                reject(new CustomError(message.NotFound, StatusCodes.NOT_FOUND))
            }
        }catch(error){
            reject(error)   
        }
    })
}


function detailsSubCategory(params:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
        const language = headers.language ? headers.language : 'en'
        const message = messages(language)
        try{
            const { id } = params
            const find = await subCategoryModel.findOne({_id:id})
            if(find){
                resolve(find)
            }else{
                reject(new CustomError(message.NoSubCategoryExistsWithThisId, StatusCodes.NOT_FOUND))
            }
        }catch(error){
            reject(error)  
        }
    })
}


function statusSubCategory(body:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
        const language = headers.language ? headers.language : 'en'
        const message = messages(language)
        try{
             const { status, subCategoryId } = body
             const check = await subCategoryModel.findByIdAndUpdate({_id:subCategoryId}, {isActive:status}, {new:true})
             if(!check){
                 reject(new CustomError(message.NoSubCategoryExistsWithThisId, StatusCodes.NOT_FOUND))
             }else{
                resolve(check)
             }
        }catch(error){    
            reject(error)
        }
    })
}


export default {
    addSubCategory,
    editSubCategory,
    listSubCategory,
    deleteSubCategory,
    detailsSubCategory,
    statusSubCategory
}
