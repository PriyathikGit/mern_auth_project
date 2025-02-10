import express from 'express';
import { signIn, signup,googleAuth } from '../controller/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signIn);
router.post('/google',googleAuth)
export default router;
