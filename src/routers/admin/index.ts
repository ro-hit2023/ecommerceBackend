import { Router } from "express";
import authRoute from "./auth";
import categoryRoute from "./category";
import subCategory from "../../controllers/admin/subCategory";
import subCategoryRoute from "./subCategory";
import subsubCategoryRoute from "./subsubCategory";
import catSpecificationRoute from "./catSpecification";
import geoSpatialRoute from "./testingGeospatial";

const baserouter = Router();

baserouter.use("/authRoute", authRoute);
baserouter.use("/categoryRoute", categoryRoute);
baserouter.use("/subCategoryRoute", subCategoryRoute);
baserouter.use("/subsubCategoryRoute", subsubCategoryRoute);
baserouter.use('/catSpecification', catSpecificationRoute);
baserouter.use('/testingGeospatial', geoSpatialRoute)
export default baserouter;
