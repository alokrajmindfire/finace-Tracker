import { Router } from 'express';

import { verifyJWT } from '../middleware/auth.middleware';
import { categories, addCategories } from '../controller/category.controller';
import { validateResource } from 'src/middleware/validatereq.middleare';
import { addCategorySchema } from 'src/validations/category.validation';

const router = Router();

router.route('/').get(verifyJWT, categories);
router
  .route('/')
  .post(verifyJWT, validateResource(addCategorySchema), addCategories);

export default router;
