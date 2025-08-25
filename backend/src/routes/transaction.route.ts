import { Router } from 'express';

import { verifyJWT } from '../middleware/auth.middleware';
import {
  transactions,
  transaction,
  addTransactions,
  editTransaction,
  deleteTransaction,
  getSpendingOverview,
} from '../controller/transaction.controller';
import { validateResource } from 'src/middleware/validate-req.middleware';
import {
  addTransactionSchema,
  deleteTransactionSchema,
  editTransactionSchema,
  getTransactionSchema,
} from 'src/validations/transaction.schema';

const router = Router();

router.route('/').get(verifyJWT, transactions);
router.route('/spending-overview').get(verifyJWT, getSpendingOverview);
router
  .route('/:id')
  .get(verifyJWT, validateResource(getTransactionSchema), transaction);
router
  .route('/')
  .post(verifyJWT, validateResource(addTransactionSchema), addTransactions);
router
  .route('/:id')
  .put(verifyJWT, validateResource(editTransactionSchema), editTransaction);
router
  .route('/:id')
  .delete(
    verifyJWT,
    validateResource(deleteTransactionSchema),
    deleteTransaction,
  );

export default router;
