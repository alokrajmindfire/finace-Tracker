import { Router } from 'express';

import {
  loginUser,
  logoutUser,
  registerUser,
} from '../controller/auth.controller';
import { verifyJWT } from '../middleware/auth.middleware';

const router = Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/logout').post(verifyJWT, logoutUser);

export default router;
