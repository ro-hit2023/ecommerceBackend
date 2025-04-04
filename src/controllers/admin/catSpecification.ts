import { StatusCodes } from "http-status-codes"
import messages from "../../custome_messages"
import catSpecificationModel from "../../models/catSpecification"
import { CustomError } from "../../utils/error"
import equipmentSpecificationModel from "../../models/equipmentSpecification"
import catSpecificationValueModal from "../../models/categorySpecificationValue"



function addSpefication(body:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
         const language = headers.language ? headers.language: 'en'
         const message = messages(language)
         console.log(body)
        try{
            body.lower_keyName = body.keyName.toLowerCase()
            body.lower_ar_keyname = body.ar_keyName.toLowerCase()
            const check = await catSpecificationModel.findOne({
                $or:[
                    {
                        isDelete:false,
                        keyName:body.keyName,
                        categoryId:body.categoryId
                    },
                    {
                        isDelete:false,
                        ar_keyName:body.ar_keyName,
                        categoryId:body.categoryId
                    }
                ]
            })
            console.log(check)
            if(check){
                reject(new CustomError(message.catSpecificationAlreadyExixt, StatusCodes.BAD_REQUEST))
            }else{
                const add = await catSpecificationModel.create(body)
                resolve(add)
            }
        }catch(error){
            reject(error)
        }
    })
}


function editSpefication(body:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
        const language = headers.language ? headers.language: 'en'
         const message = messages(language)
        try{
            const { id, categoryId } = body
            const find = await catSpecificationModel.findOne({
                $or:[
                    {
                        isDelete:false,
                        keyName:body.keyName,
                        categoryId:categoryId
                    },
                    {
                        isDelete:false,
                        ar_keyName:body.ar_keyName,
                        categoryId:categoryId
                    }
                ],
                _id:{
                    $ne:id
                }
            })
            if(find){
                reject(new CustomError(message.catSpecificationAlreadyExixt.replace("{{CatSpecification}}", `${body.keyName} OR ${body.ar_keyName}`), StatusCodes.BAD_REQUEST))
            }else{
                const edit = await catSpecificationModel.findOneAndUpdate({_id:id}, body, {new:true})
                resolve(edit)
            }
        }catch(error){

        }
    })
}

function listSpefication(body:any, headers:any):Promise<any>{
    return new Promise(async(resolve, reject)=>{
        try{
            const { search, isActive, page, perPage } = body
            const page1 = parseInt(page) || 1
            const perPage1 = parseInt(perPage) || 10
            const skip = (page1-1)*perPage1
            var obj:any = { isDelete:false }
            if(search){
                obj = {
                    ...obj,
                    $or:[
                       { lower_keyName:{$regex:search, $options:"i"}},
                       { lower_ar_keyName:{$regex:search, $options:"i"}}
                    ]
                }
            }

            if(isActive === "active"){
                obj.isActive = true
            }else if(isActive == "Inactive"){
                obj.isActive = false
            }else if(isActive === "all"){
                obj.isActive = null
            }
            const [list, TotalCount] =  await Promise.all([
                catSpecificationModel.aggregate([
                    {
                        $match:obj   
                    },
                    {
                        $sort:{createdAt:-1}
                    },
                    {
                        $facet:{
                            count:[{$count:"total"}],
                            document:[{$skip:skip},{$limit:perPage1}]
                        }
                    }
                ]),
                catSpecificationModel.countDocuments()
            ])
            const count1 = list[0].count[0].total 
            const document1 = list[0].document
            resolve({document1, count1, TotalCount})
        }catch(error){
            reject(error)
        }
    })
}



function delete_Specification(params: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        const { language } = headers;
        const message = messages(language);
        try {
            const { id } = params;
            const specification = await catSpecificationModel.findByIdAndUpdate(
                {_id:id, isDelete:false},
                {isDelete:true},
                {new:true}
            )
            console.log(specification)
            if (!specification) {
                reject(new CustomError(message.NocatSpecificationWithThisId, StatusCodes.NOT_FOUND));
            } else {
                await catSpecificationModel.findByIdAndUpdate(id, { isDelete: true }, { new: true });
                await equipmentSpecificationModel.updateMany({ keyId: id }, { isDelete: true });
                await catSpecificationValueModal.updateMany({ keyId: id }, { isDelete: true })
                resolve({ success: true });
            }
        } catch (error) {
            reject(error);
        }
    });
}


function detailSpecification(params: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = params;
            const findDataById = await catSpecificationModel.findOne({
                _id: id,
                isDelete: false,
            });
            resolve(findDataById);
        } catch (error) {
            reject(error);
        }
    });
}

export default{
    addSpefication,
    editSpefication,
    listSpefication,
    detailSpecification,
    delete_Specification 
}