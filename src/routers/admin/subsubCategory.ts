import { Router }  from "express"
import { StatusCodes } from "http-status-codes"
import { validateJoiSchema, validatorJoiSchema_query } from "../../utils/schemaValidators"
import subCategory from "../../controllers/admin/subCategory"
import { checkRole, verifyToken } from "../../helpers/verify"
import { addsubSubCategory_Schema, editsubSubCategory_Schema, subCategoryEdit_Schema, sunCategory_Schema } from "../../Validators/admin"
import subsubCategory from "../../controllers/admin/subsubCategory"


const subsubCategoryRoute =  Router()

const s = {
    addsubSubCategory:"/addsubSubCat",
    listsubSubCategory:"/listsubSubCategory",
    changesubStatus:"/approvesubSubCategory",
    delete:"/delete/:id",
    edit:"/editSubSubCat",
    details:"/details/:id"
}

const { OK, CREATED } =  StatusCodes


subsubCategoryRoute.post(s.addsubSubCategory, verifyToken, checkRole(["admin"]), validateJoiSchema(addsubSubCategory_Schema), async(req, res)=>{
    const data = await subsubCategory.addsubSubCategory(
        req.body,
        req.headers
    )
    res.status(CREATED).json({CREATED, data})
})

subsubCategoryRoute.get(s.listsubSubCategory, verifyToken, async(req, res)=>{
    const data = await subsubCategory.listsubSubCategory(
        req.query,
        req.headers
    )
    res.status(OK).json({OK, data})
})

subsubCategoryRoute.patch(s.changesubStatus, verifyToken, checkRole(["admin"]) , async(req, res)=>{
    const data = await subsubCategory.changeStatusSubSubCategory(
        req.body,
        req.headers
    )
    res.status(OK).json({OK, data})
})

subsubCategoryRoute.delete(s.delete, verifyToken, checkRole(["admin"]), async(req, res)=>{
   const data = await subsubCategory.deletesubSubCategory(
    req.params,
    req.headers
   )
   res.status(OK).json({OK, data})
})

subsubCategoryRoute.post(s.edit, verifyToken, checkRole(["admin"]), validateJoiSchema(editsubSubCategory_Schema), async(req, res)=>{
    const data = await subsubCategory.editsubSubCategory(
        req.body,
        req.headers
    )
    res.status(OK).json({OK, data})
})

subsubCategoryRoute.get(s.details, verifyToken, checkRole(["admin"]), async(req, res)=>{
    const data = await subsubCategory.detailsSubSubCategory(
        req.params,
        req.headers
    )
    res.status(OK).json({OK, data})
})

export default subsubCategoryRoute
