import { Router } from "express";

import { verifyJWT } from "@/middleware/auth.middleware";
import { categories } from "@/controller/category.controller";


const router = Router()

router.route("/").post(verifyJWT,categories)

export default router