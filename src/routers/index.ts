import { Router } from "express";
import commonRoute from "./comman_api/index"

const baserouter = Router()

baserouter.use('/common', commonRoute)






















export default baserouter