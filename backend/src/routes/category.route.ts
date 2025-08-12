import { Router } from "express";

import { verifyJWT } from "@/middleware/auth.middleware";
import { categories, addCategories } from "@/controller/category.controller";


const router = Router()

router.route("/").get(verifyJWT,categories)
router.route("/").post(verifyJWT,addCategories)

export default router