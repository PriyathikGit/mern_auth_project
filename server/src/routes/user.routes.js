import express from 'express';
import { verifyJwt } from '../middleware/verifyJwt.js';
import { deleteAccount } from '../controller/user.controller.js';

const router = express.Router();

router.delete('/delete/:userId', verifyJwt, deleteAccount);

export default router;
