import { Router }  from "express"
import { StatusCodes } from "http-status-codes"
import { validateJoiSchema, validatorJoiSchema_query } from "../../utils/schemaValidators"
import subCategory from "../../controllers/admin/subCategory"
import { checkRole, verifyToken } from "../../helpers/verify"
import { list_sub_CategoryValidator, subCategoryEdit_Schema, sunCategory_Schema } from "../../Validators/admin"

const subCategoryRoute =  Router()

const s = {
    addSubCategory:"/addSubCat",
    listSubCategory:"/listSubCategory",
    changeStatus:"/approveSubCategory",
    delete:"/delete/:id",
    edit:"/editSubCat",
    details:"/details/:id"
}

const { OK, CREATED } =  StatusCodes


subCategoryRoute.post(s.addSubCategory, validateJoiSchema(sunCategory_Schema), async(req, res)=>{
    const data = await subCategory.addSubCategory(
        req.body,
        req.headers
    )
    res.status(CREATED).json({CREATED, data})
})

subCategoryRoute.get(s.listSubCategory, verifyToken, validatorJoiSchema_query(list_sub_CategoryValidator), async(req, res)=>{
    const data = await subCategory.listSubCategory(
        req.query,
        req.headers
    )
    res.status(OK).json({OK, data})
})

subCategoryRoute.patch(s.changeStatus, verifyToken, checkRole(["admin"]) , async(req, res)=>{
    const data = await subCategory.statusSubCategory(
        req.body,
        req.headers
    )
    res.status(OK).json({OK, data})
})

subCategoryRoute.delete(s.delete, verifyToken, checkRole(["admin"]), async(req, res)=>{
   const data = await subCategory.deleteSubCategory(
    req.params,
    req.headers
   )
   res.status(OK).json({OK, data})
})

subCategoryRoute.post(s.edit, verifyToken, checkRole(["admin"]), validateJoiSchema(subCategoryEdit_Schema) , async(req, res)=>{
    const data = await subCategory.editSubCategory(
        req.body,
        req.headers
    )
    res.status(OK).json({OK, data})
})

subCategoryRoute.get(s.details, verifyToken, checkRole(["admin"]), async(req, res)=>{
    const data = await subCategory.detailsSubCategory(
        req.params,
        req.headers
    )
    res.status(OK).json({OK, data})
})

export default subCategoryRoute
