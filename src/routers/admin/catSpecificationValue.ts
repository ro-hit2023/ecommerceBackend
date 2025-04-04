import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { checkRole, verifyToken } from "../../helpers/verify";
import { validateJoiSchema, validatorJoiSchema_query } from "../../utils/schemaValidators";
import { catSpecification_Schema, edit_catSpecification_Schema } from "../../Validators/admin";
import catSpecificationValue from "../../controllers/admin/catSpecificationValue";


const catSpecificationvalueRoute = Router()

const c = {
    addCategory:"/addCatSpecification",
    listCategory:"/listCatSpecifiction",
    delete:"/delete/:id",
    edit:"/editCatSpecification",
    details:"/detailsCatSpecification/:id"
}

const { OK, CREATED } =  StatusCodes

catSpecificationvalueRoute.post(c.addCategory, verifyToken, validateJoiSchema(catSpecification_Schema), async(req, res)=>{
    const data = await catSpecificationValue.addSpecificationValue(
        req.body,
        req.headers
    )
    res.status(CREATED).json({CREATED, data})
})

catSpecificationvalueRoute.get(c.listCategory, verifyToken, async(req, res)=>{
    const data = await catSpecificationValue.listSpecificationValue(
        req.query,
        req.headers
    )
    res.status(OK).json({OK, data})
})


// catSpecificationRoute.delete(c.delete, verifyToken, checkRole(["admin"]), async(req, res)=>{
//    const data = await catSpecification.(
//     req.params,
//     req.headers
//    )
//    res.status(OK).json({OK, data})
// })

catSpecificationvalueRoute.post(c.edit, verifyToken, checkRole(["admin"]), validateJoiSchema(edit_catSpecification_Schema), async(req, res)=>{
    const data = await catSpecificationValue.editSpecificationValue(
        req.body,
        req.headers
    )
    res.status(OK).json({OK, data})
})

catSpecificationvalueRoute.get(c.details, verifyToken, checkRole(["admin"]), async(req, res)=>{
    const data = await catSpecificationValue.detailsSpecificationValue(
        req.params,
        req.headers
    )
    res.status(OK).json({OK, data})
})

export default catSpecificationvalueRoute




