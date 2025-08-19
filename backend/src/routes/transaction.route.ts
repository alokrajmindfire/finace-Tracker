import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware";
import { transactions, transaction, addTransactions, editTransaction, deleteTransaction, getSpendingOverview  } from "../controller/transaction.controller";


const router = Router()

router.route("/").get(verifyJWT,transactions)
router.route("/spending-overview").get(verifyJWT,getSpendingOverview)
router.route("/:id").get(verifyJWT,transaction)
router.route("/").post(verifyJWT,addTransactions)
router.route("/:id").put(verifyJWT,editTransaction)
router.route("/:id").delete(verifyJWT,deleteTransaction)


export default router