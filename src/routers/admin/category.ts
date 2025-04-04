import { Router } from "express";
import categoryModel from "../../models/category";
import category from "../../controllers/admin/category";
import { StatusCodes } from "http-status-codes";
import { validateJoiSchema, validatorJoiSchema_query } from "../../utils/schemaValidators";
import { catValidator_Schema, changeStatus_Schema, details_Schema, editCat_Schema } from "../../Validators/admin";
import { checkRole, verifyToken } from "../../helpers/verify";
import { check } from "express-validator";


const categoryRoute = Router()

const c = {
    addCategory:"/addCat",
    listCategory:"/listCategory",
    changeStatus:"/approveAdmin",
    delete:"/delete/:id",
    edit:"/editCat",
    details:"/details/:id"
}

const { OK, CREATED } =  StatusCodes

categoryRoute.post(c.addCategory, verifyToken, validateJoiSchema(catValidator_Schema), async(req, res)=>{
    const data = await category.addCategory(
        req.body,
        req.headers    
    )
    res.status(CREATED).json({CREATED, data})
})



categoryRoute.get(c.listCategory, verifyToken, async(req, res)=>{
    const data = await category.listCategory(
        req.query,
        req.headers
    )
    res.status(OK).json({OK, data})
})

categoryRoute.patch(c.changeStatus, verifyToken, checkRole(["admin"]), validatorJoiSchema_query(changeStatus_Schema) , async(req, res)=>{
    const data = await category.changeStatus(
        req.query,
        req.headers
    )
    res.status(OK).json({OK, data})
})

categoryRoute.delete(c.delete, verifyToken, checkRole(["admin"]), async(req, res)=>{
   const data = await category.deleteCategory(
    req.params,
    req.headers
   )
   res.status(OK).json({OK, data})
})

categoryRoute.post(c.edit, verifyToken, checkRole(["admin"]), validateJoiSchema(editCat_Schema), async(req, res)=>{
    const data = await category.editCat(
        req.body,
        req.headers
    )
    res.status(OK).json({OK, data})
})

categoryRoute.get(c.details, verifyToken, checkRole(["admin"]), async(req, res)=>{
    const data = await category.categoryDetails(
        req.params,
        req.headers
    )
    res.status(OK).json({OK, data})
})

export default categoryRoute




