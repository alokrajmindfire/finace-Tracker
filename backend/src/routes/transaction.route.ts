import { Router } from "express";

import { verifyJWT } from "@/middleware/auth.middleware";
import { transactions, addTransactions, editTransaction, deleteTransaction } from "@/controller/transaction.controller";


const router = Router()

router.route("/").get(verifyJWT,transactions)
router.route("/").post(verifyJWT,addTransactions)
router.route("/:id").put(verifyJWT,editTransaction)
router.route("/:id").delete(verifyJWT,deleteTransaction)


export default router