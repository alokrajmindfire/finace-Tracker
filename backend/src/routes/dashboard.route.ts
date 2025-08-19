import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware";
import { getOverview,getCategoryBreakdown,getMonthlySummary } from "../controller/dashboard.controller";


const router = Router()

router.route("/overview").get(verifyJWT,getOverview)
router.route("/category-breakdown").get(verifyJWT,getCategoryBreakdown)
router.route("/monthly-summary").get(verifyJWT,getMonthlySummary)


export default router