// routes/productRoutes.js
import express from 'express';
import upload from '../config/multer.js';
import { uploadProduct } from "../controller/uploads.controller.js";

const router = express.Router();

router.post('/upload-product', upload.single('image'), uploadProduct);

export default router;
