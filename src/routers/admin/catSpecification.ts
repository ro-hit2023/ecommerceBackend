import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { checkRole, verifyToken } from "../../helpers/verify";
import { validateJoiSchema, validatorJoiSchema_query } from "../../utils/schemaValidators";
import catSpecification from "../../controllers/admin/catSpecification";
import { catSpecification_Schema, edit_catSpecification_Schema } from "../../Validators/admin";


const catSpecificationRoute = Router()

const c = {
    addCategory:"/addCatSpecification",
    listCategory:"/listCatSpecifiction",
    delete:"/delete/:id",
    edit:"/editCatSpecification",
    details:"/detailsCatSpecification/:id"
}

const { OK, CREATED } =  StatusCodes

catSpecificationRoute.post(c.addCategory, verifyToken, validateJoiSchema(catSpecification_Schema), async(req, res)=>{
    const data = await catSpecification.addSpefication(
        req.body,
        req.headers
    )
    res.status(CREATED).json({CREATED, data})
})

catSpecificationRoute.get(c.listCategory, verifyToken, async(req, res)=>{
    const data = await catSpecification.listSpefication(
        req.query,
        req.headers
    )
    res.status(OK).json({OK, data})
})


catSpecificationRoute.delete(c.delete, verifyToken, checkRole(["admin"]), async(req, res)=>{
   const data = await catSpecification.delete_Specification(
    req.params,
    req.headers
   )
   res.status(OK).json({OK, data})
})

catSpecificationRoute.post(c.edit, verifyToken, checkRole(["admin"]), validateJoiSchema(edit_catSpecification_Schema), async(req, res)=>{
    const data = await catSpecification.editSpefication(
        req.body,
        req.headers
    )
    res.status(OK).json({OK, data})
})

// catSpecificationRoute.get(c.details, verifyToken, checkRole(["admin"]), async(req, res)=>{
//     const data = await catSpecification.detailsSpefication(
//         req.params,
//         req.headers
//     )
//     res.status(OK).json({OK, data})
// })

export default catSpecificationRoute




