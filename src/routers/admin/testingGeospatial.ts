import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import testingGeospatial from "../../controllers/admin/testingGeospatial";
import { validateJoiSchema } from "../../utils/schemaValidators";
import { geoWithin_Validator } from "../../Validators/admin";

const geoSpatialRoute = Router()

const {OK, CREATED} = StatusCodes

const g = {
    addGeospatialLocation :"/addGeospatialLocation",
    testLocation:"/testLocation",
    addGetIntersectionData:"/addGetIntersectionData",
    geoWithin:"/geoWithinTesting",
    getGeoWithin:"/getGeoWithin"
}

// geoSpatialRoute.post(g.addGeospatialLocation, async(req, res)=>{
//     const data = await testingGeospatial.testingGeospatial(
//         req.body,
//         req.headers
//     )
//     res.status(CREATED).json({CREATED, data})
// })

// geoSpatialRoute.get(g.testLocation, async(req, res)=>{
//     const data = await testingGeospatial.findNearLocation(
//         req.body,
//         req.headers
//     )
//     res.status(OK).json({OK, data})
// })

// geoSpatialRoute.post(g.addGetIntersectionData, async(req, res)=>{
//     const data = await testingGeospatial.saveGeoTestData(
//         req.body,
//         req.headers
//     )
//     res.status(OK).json({OK, data})
// })


geoSpatialRoute.post(g.geoWithin, validateJoiSchema(geoWithin_Validator), async(req, res)=>{
    const data = await testingGeospatial.storeGeoWithinData(
        req.body,
        req.headers
    )
    res.status(OK).json({OK, data})
})

geoSpatialRoute.get(g.getGeoWithin, async(req, res)=>{
    const data = await testingGeospatial.queryGeoWithinDat(
        req.body,
        req.headers
    )
    res.status(OK).json({OK, data})
})

export default geoSpatialRoute
