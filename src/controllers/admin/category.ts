import { StatusCodes } from "http-status-codes"
import messages from "../../custome_messages"
import categoryModel from "../../models/category"
import { CustomError } from "../../utils/error"
import { identityGenerator } from "../../helpers/helpers"
import { resolve } from "path"
import mongoose from "mongoose"
import subCategoryModel from "../../models/subCategory"
import subsubCategoryModel from "../../models/subsubCategory"




// function addCategory(body:any, headers:any):Promise<any>{
//     return new Promise(async(resolve, reject)=>{
//         const language = headers.language ? headers.language : 'en'
//         const message = messages(language)
//         console.log('inside api')
//         try{
//             body.lower_name = body.name.toLowerCase()
//             body.lower_ar_name = body.ar_name.toLowerCase()
//             const count = await categoryModel.countDocuments()
//             const uniqueId = await identityGenerator("adminCategory", count)   
//             const check = await categoryModel.findOne({
//                 $or:[
//                     {
//                         isDelete:false,
//                         lower_name:body.lower_name
//                     },
//                     {
//                         isDelete:false,
//                         lower_ar_name:body.lower_ar_name
//                     }
//                 ]
//             })
//             if(check){
//                 reject(new CustomError(message.CategoryAlreadyExists.replace("{{catName}}", `${body.name}`), StatusCodes.BAD_REQUEST))
//             }else{
//                 body.uniqueId = uniqueId
//                 const createCat = await categoryModel.create(body)
//                 if(createCat){
//                 resolve(createCat)
//                 }
//             }
//         }catch(error){
//             reject(error)
//         }
//     })
// }

function addCategory(body: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        const language = headers.language ? headers.language : 'en';
        const message = messages(language);
        
        try {
            // Validate and normalize name fields
            if (!body.name) {
                reject(new CustomError(message.NoAccountMatch, StatusCodes.BAD_REQUEST));
                return;
            }

            if (!body.ar_name) {
                reject(new CustomError(message.NoAccountMatch, StatusCodes.BAD_REQUEST));
                return;
            }

            // Convert array to string if needed (comma-separated)
            if (Array.isArray(body.name)) {
                body.name = body.name.join(', ');
            }
            if (Array.isArray(body.ar_name)) {
                body.ar_name = body.ar_name.join(', ');
            }

            // Create lowercase versions
            body.lower_name = body.name.toLowerCase();
            body.lower_ar_name = body.ar_name.toLowerCase();
            
            const count = await categoryModel.countDocuments();
            const uniqueId = await identityGenerator("adminCategory", count);
            
            // Check for existing category
            const check = await categoryModel.findOne({
                $or: [
                    { isDelete: false, lower_name: body.lower_name },
                    { isDelete: false, lower_ar_name: body.lower_ar_name }
                ]
            });

            if (check) {
                reject(new CustomError(
                    message.CategoryAlreadyExists.replace("{{catName}}", body.name), 
                    StatusCodes.BAD_REQUEST
                ));
                return;
            }

            // Set defaults
            body.image = body.image || "";
            body.isActive = body.isActive !== undefined ? body.isActive : false;
            body.uniqueId = uniqueId;

            const createCat = await categoryModel.create(body);
            if (createCat) {
                resolve({
                    status: 'success',
                    message: message.NoAccountMatch,
                    data: createCat
                });
            }
        } catch (error) {
            console.error('Error in addCategory:', error);
            reject(error);
        }
    });
}



 


function listCategory(query:any, headers:any):any{
    return new Promise(async(resolve, reject)=>{
        const language = headers.language || 'en'
        const message = messages(language)
        try{
            const { search, isActive, page , perPage } = query
            const page1= parseInt(page) || 1
            const perPage1 = parseInt(perPage) || 10
            const skip = (page1-1)*perPage1
            var obj:any = {isDelete:false}
        if(search){
            obj = {
              ...obj,
              $or:[
                {name:{'$regex':search, $options:'i'}},
                {ar_name:{'$regex':search, $options:'i'}},
                {uniqueId:{'$regex':search, $options:'i'}}
              ]  
          }
        }
        if(isActive === "active"){
            obj.isActive = true
        }else if(isActive === "Inactive"){
            obj.isActive === false
        }else{
            obj.isActive === null
        }
            const [list,TotalCount] = await Promise.all([categoryModel.aggregate([
                {
                    $match:obj
                },
                {
                    $lookup:{
                        from:"subcategories",
                        let:{categoryId:"$_id"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $and:[
                                            {$eq:["$categoryId","$$categoryId"]},
                                            {$eq:["$isDelete",false]}
                                        ],
                                    },
                                },
                            },           
                        ],
                        as:"subCategoryData",
                    }
                },
                {
                    $lookup:{
                        from:"subsubcategories",
                        let:{categoryId:"$_id"},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $and:[
                                            {$eq:["$categoryId", "$$categoryId"]},
                                            {$eq:["$isDelete", false]}
                                        ]
                                    }
                                }
                            }
                        ],
                        as:"subsubCategoryData"
                    }
                },
                {
                    $project:{
                        name:1,
                        ar_name:1,
                        uniqueId:1,
                        lower_name: 1,
                        lower_ar_name: 1,
                        isActive:1,
                        isDelete:1,
                        subCategoryCount:{$size:"$subCategoryData"},
                        subsubCategoryCount:{$size:"$subsubCategoryData"}
                    }
                },
                {
                    $facet:{
                        count:[{$count:"total"}],
                        document:[{$skip:skip},{$limit:perPage1}]
                    }, 
                }
               
            ]),
            categoryModel.countDocuments(obj)
        ])
        const Count = list[0]?.count[0]?.total || 0
        const extracatList = list[0]?.document || {}           
            resolve({extracatList,Count,TotalCount})
        }catch(error){
            reject(error)
        }
    })
}



function changeStatus(query:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
        const language = headers.language || 'en'
        const message =  messages(language)
        const session = await mongoose.startSession()
        await session.startTransaction()
        try{
            const { status, id } = query
            const changeStatus = await categoryModel.findOneAndUpdate({_id:id}, {isActive:status}, {new:true, session})
            if(changeStatus){
                await subCategoryModel.updateMany(
                    {categoryId:id, isDelete:false},
                    {isActive:status},
                    {session}
                ),
                await subsubCategoryModel.updateMany(
                    {categoryId:id, isDelete:false},
                    {isActive:status},
                    {session}
                )
                await session.commitTransaction()
                resolve({success:true})
            }else{
                await session.abortTransaction()
                reject(new CustomError(message.NotFound, StatusCodes.NOT_FOUND))
            }
        }catch(error){
            await session.abortTransaction()
            reject(error)
        }finally{
            await session.endSession()
        }
    })
}


function deleteCategory(params:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
        const language = headers.language || 'en'
        const message =  messages(language)
        const session = await mongoose.startSession()
        await session.startTransaction()
        try{
            const { id } = params
            const deletCat = await categoryModel.findByIdAndUpdate({_id:id}, {isDelete:true}, {new:true, session})
            if(deletCat){
                await subCategoryModel.updateMany(
                    {categoryId:id, isDelete:false},
                    {isDelete:true},
                    {session}
                ),
                await subsubCategoryModel.updateMany(
                    {categoryId:id, isDelete:false},
                    {isDelete:true},
                    {session}
                )
                await session.commitTransaction()
                resolve({success:true})
            }else{
                await session.abortTransaction()
                reject(new CustomError(message.CategoryWithThisIdDoesNotExist, StatusCodes.NOT_FOUND))
            } 
        }catch(error){
            await session.abortTransaction()
            reject(error)
        }finally{
            await session.endSession()
        }
    })
}
  

function editCat(body:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
        const language = headers.language || 'en'
        const message =  messages(language)
        const session = await mongoose.startSession()
        await session.startTransaction()
        try{
            const { name, ar_name, id } = body
            body.lower_name = name.toLowerCase()
            body.lower_ar_name = ar_name.toLowerCase()
            const check = await categoryModel.findOne({
                $or:[
                    {
                        isDelete:false,
                        lower_name:body.lower_name
                    },
                    {
                        isDelete:false,
                        lower_ar_name:body.lower_ar_name
                    }
                ],
                _id:{
                    $ne: id
                }
            })
           
            if(!check){
                const update = await categoryModel
                .findByIdAndUpdate( 
                   { _id:id, isDelete:false},
                    body,
                    { new: true, session }
                )
                .select('-createdAt -isDeleted -updatedAt -uniqueId');  
                await subCategoryModel.updateMany(
                   {categoryId:id},
                    {isActive:body.isActive},
                   {session}
                );
                await subsubCategoryModel.updateMany(
                   {categoryId:id},
                    {isActive:body.isActive},
                   {session}
                );
               await session.commitTransaction()
                resolve({success:true})
            }else{
                reject(new CustomError(message.CategoryAlreadyExists, StatusCodes.BAD_REQUEST))
            }
        }catch(error){
           await session.abortTransaction()
            reject(error)
        }finally{
           await session.endSession()
        }
    })
}

// function categoryDetails(params:any, headers:any):Promise<any>{
//     return new Promise(async(resolve, reject)=>{
//         const language = headers.language || 'en'
//         const message =  messages(language)
//         try{
//             const { id } = params
//             const check = await categoryModel.findOne({_id:id})
//             if(check){
//                 resolve(check)
//             }else{
//                 reject(new CustomError(message.CategoryWithThisIdDoesNotExist, StatusCodes.BAD_REQUEST))
//             }      
//         }catch(error){
//            reject(error)
//         }
//     })
// }


function categoryDetails(params:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
        const language = headers.language || 'en'
        const message =  messages(language)
        try{
            const result = await categoryModel.find({ name: "A", ar_name:"B"}).explain("allPlansExecution");
            console.log(result);
            resolve(result)
        }catch(error){
           reject(error)
        }
    })
}



export default {
    addCategory,
    listCategory,
    changeStatus,
    deleteCategory,
    editCat,
    categoryDetails
} as const // as const is used to make the exported object immutable and readonly at the type level in TypeScript.
