import express from 'express';
import {
  signIn,
  signup,
  googleAuth,
  uploadDetails,
  signOut
} from '../controller/auth.controller.js';
import { upload } from '../middleware/Multer.middleware.js';
import { verifyJwt } from '../middleware/verifyJwt.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signIn);
router.post('/google', googleAuth);
router.patch(
  '/:userId',
  verifyJwt,
  upload.single('profilePicture'),
  uploadDetails
);
router.get('/signOut', signOut);

export default router;
