import { StatusCodes } from "http-status-codes"

import mongoose from "mongoose"
import messages from "../../custome_messages"
import subsubCategoryModel from "../../models/subsubCategory"
import { identityGenerator } from "../../helpers/helpers"
import { CustomError } from "../../utils/error"


function addsubSubCategory(body:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
        const language = headers.language? headers.language: 'en'
        const message = messages(language)
        try{
            body.lower_name = body.name.toLowerCase()
            body.lower_ar_name = body.ar_name.toLowerCase()
            const count = await subsubCategoryModel.countDocuments()
            const uniqueSubSubId =  identityGenerator('admin_sub_sub_category', count)
            const check = await subsubCategoryModel.findOne({
                $or:[
                    {
                        isDelete:false,
                        lower_name:body.lower_name,
                        categoryId:body.categoryId,
                        subCategoryId:body.subCategoryId
                    },
                    {
                        isDelete:false,
                        lower_ar_name:body.subsubcategoryId,
                        categoryId:body.categoryId,
                        subCategoryId:body.subCategoryId
                    }
                ]
            })
            if(check){
                reject(new CustomError(message.SubSubCategoryAlreadyExist.replace("{{SubSubCategory}}", `${body.name}`), StatusCodes.NOT_FOUND))
            }else{
                body.uniqueSubSubId = uniqueSubSubId
                const save =  await subsubCategoryModel.create(body)
                resolve(save)
            }
        }catch(error){
            reject(error)
        }
    })
}


function editsubSubCategory(body: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const { language } = headers;
      const message = messages(language);
      try {
        const { id } = body;
        body.lower_name = body.name.toLowerCase();
        body.ar_lower_name = body.ar_name.toLowerCase();
        const findOneAndUpdateData = await subsubCategoryModel.findOne({
          $or: [
            {
              isDelete: false,
              lower_name: body.lower_name,
              categoryId: body.categoryId,
              subCategoryId: body.subCategoryId,
            },
            {
              isDelete: false,
              ar_lower_name: body.ar_lower_name,
              categoryId: body.categoryId,
              subCategoryId: body.subCategoryId,
            },
          ],
          _id: {
            $ne: id,
          },
        });
        if (findOneAndUpdateData === null) {
         const updatedData =  await subsubCategoryModel.findOneAndUpdate(
            { _id: id, isDelete: false },
            {
              name: body?.name,
              ar_name: body?.ar_name,
              lower_name: body?.lower_name,
              ar_lower_name: body?.ar_lower_name,
              image: body?.image,
              isActive: body?.isActive, ///updated
            }
          );
          resolve({ success: true });
        } else {
          reject(
            new CustomError(
              message.NosubSubCategoryExistsWithThisId.replace(
                "{{SubSubCategory}}",
                `${body.name} OR ${body.ar_name}`
              ),
              StatusCodes.BAD_REQUEST
            )
          );
        }
      } catch (error) {
        reject(error);
      }
    });
  }

function listsubSubCategory(query:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
        const language = headers.language?headers.language: 'en'
        const message = messages(language)
        try{
            const { search, isActive, categoryId, subCategoryId, page, perPage } = query
            console.log(categoryId, subCategoryId )
            const page1 = parseInt(page) || 1
            const perPage1 = parseInt(perPage) || 10
            const skip = (page1-1)*perPage1
            var obj:any = {
                isDelete:false,
                categoryId: new mongoose.Types.ObjectId(categoryId),
                subCategoryId:new mongoose.Types.ObjectId(subCategoryId)
            }

            if(search){
                obj = {
                    ...obj,
                    $or:[
                        {name:{$regex:search, $options:'i'}},
                        {ar_name:{$regex:search, $options:'i'}},
                        {uniqueID:{$regex:search, $options:'i'}}
                    ]
                }
            }
            if(isActive === "active"){
                obj.isActive = true
            }else if(isActive === "InActive"){
                obj.isActive = false
            }else if(isActive === "all"){
                obj.IsActive = null
            }
            const [list, TotalCount] = await Promise.all([subsubCategoryModel.aggregate([
                {
                    $match:obj
                },
                {
                    $facet:{
                        count:[{$count: "total"}],
                        document:[{$skip:skip},{$limit:perPage1}]
                    }
                }
            ]),
              await subsubCategoryModel.countDocuments()
            ])
           const count = list[0].count[0].total
           const data = list[0].document
            resolve({data, count, TotalCount})
        }catch(error){
            reject(error)
        }
    })
}

function deletesubSubCategory(params:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
        const language = headers.language ? headers.language: 'en'
         const message = messages(language)
        try{
            const { id } = params 
            const deleteSubCat = await subsubCategoryModel.updateOne({_id:id}, {isDelete:true})
            if(deleteSubCat.modifiedCount === 1){
                resolve({success:true})
            }else{
                reject(new CustomError(message.NosubSubCategoryExistsWithThisId, StatusCodes.NOT_FOUND))
            }
        }catch(error){
            reject(error)
        }
    })


}function detailsSubSubCategory(params:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
        const language = headers.language?headers.language: 'en'
        const message = messages(language)
        try{
            const { id } = params;
            const details = await subsubCategoryModel.findOne({_id:id})
            if(details){
                resolve(details)
            }else{
                reject(new CustomError(message.NosubSubCategoryExistsWithThisId, StatusCodes.NOT_FOUND))
            }
        }catch(error){
            reject(error)
        }
    })
}


function changeStatusSubSubCategory(body:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
        const language = headers.language?headers.language: 'en'
        const message = messages(language)
        try{
            const { id, status } = body
            const findandUpdate = await subsubCategoryModel.findByIdAndUpdate({_id:id},{isActive:status}, {new:true})
            if(findandUpdate){
                resolve({sucess:true})
            }else{
                reject(new CustomError(message.NosubSubCategoryExistsWithThisId, StatusCodes.NOT_FOUND))
            }
        }catch(error){
            reject(error)
        }
    })
}


export default {
    addsubSubCategory,
    editsubSubCategory,
    listsubSubCategory,
    deletesubSubCategory,
    detailsSubSubCategory,
    changeStatusSubSubCategory
} as const