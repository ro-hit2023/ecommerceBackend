import { Router } from "express";
import authRoute from "./auth";


const baserouter = Router();



baserouter.use('/auth', authRoute)



export default baserouter