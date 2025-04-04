import { StatusCodes } from "http-status-codes"
import messages from "../../custome_messages"
import catSpecificationValue from "../../models/categorySpecificationValue"
import { CustomError } from "../../utils/error"


function addSpecificationValue(body:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
        const language = headers.language?headers.language:'en'
        const message = messages(language)
        try{

            body.lower__keyValue = body.keyValue.toLowerCase()
            body.lower_ar_keyValue = body.ar_keyValue.toLowerCase()
            const check = await catSpecificationValue.findOne({
               $or:[
                {
                    isDelete:false,
                    lower_keyValue:body.lower_keyValue,
                    categoryId:body.categoryId,
                    keyId:body.keyId
                },
                {
                    isDelete:false,
                    lower_ar_keyValue:body.lower_ar_keyValue,
                    categoryId:body.categoryId,
                    keyId:body.keyId
                }
            ]           
        })
        if(check){
            reject(new CustomError(message.alreadyExist, StatusCodes.BAD_REQUEST))
        }else{
            const Save = await catSpecificationValue.create(body)
            resolve(Save)
        }
        }catch(error){
            reject(error)
        }
    })
}

function listSpecificationValue(body:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
        const language = headers.language?headers.language:'en'
        const message = messages(language)
        try{
            const { search, isActive, id, categoryId, keyId , perPage, Page} = body
            const page1 = parseInt(Page) || 1
            const perPage1 = parseInt(perPage) || 10
            const skip = (perPage1-1)*page1
            var obj:any = {
                isDelete:false,
                keyId:keyId
            }
            if(search){
                obj= {
                    ...obj,
                    $or:[
                        {keyValue:{$regex:search, $options:"i"}},
                        {categoryid:{$regex:search, $options:"i"}}
                    ]
                }
            }

            if(isActive ==="active"){
                obj.isActive = true
            }else if(isActive === "Inactive"){
                obj.isActive = false
            }else if(isActive === "all"){
                obj.isActive = null
            }

            const [list, TotalCount] = await Promise.all([
                catSpecificationValue.aggregate([
                    {
                        $match:obj
                    },
                    {
                        $facet:{
                            count:[{$count:"total"}],
                            document:[{$skip:skip},{$limit:perPage1}]
                        }
                    }

                ]),
                catSpecificationValue.countDocuments()
            ])
            const count1 = list[0].count[0].total?list[0].count[0].total:0
            const document1 = list[0].document?list[0].document:null
            resolve({document1, count1,TotalCount})

        }catch(error){
            reject(error)
        }
    })
}


function detailsSpecificationValue(params:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
        const language = headers.language?headers.language:'en'
        const message = messages(language)
        try{
            const { id } = params
            const details = await catSpecificationValue.findOne({_id:id})
            if(details){
                resolve(details)
            }else{
                reject(new CustomError(message.NotFound, StatusCodes.NOT_FOUND))
            }
        }catch(error){
            reject()

        }
    })
}


function deleteSpecificationValue(body:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
        try{
            

        }catch(error){

        }
    })
}

function editSpecificationValue(body:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
        try{
            

        }catch(error){

        }
    })
}

export default{
    addSpecificationValue,
    editSpecificationValue,
    detailsSpecificationValue,
    deleteSpecificationValue,
    listSpecificationValue
}