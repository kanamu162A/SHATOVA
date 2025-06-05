import express from 'express';
import { uploadProduct } from '../controller/uploads.controller.js';

const router = express.Router();

router.post('/upload', uploadProduct);

export default router;
