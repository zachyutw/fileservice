import express from 'express';
import {
    uploadProductImage,
    resizeImage,
} from '../modules/uploadFiles/imagesHandler';
import { uploadFile } from '../modules/uploadFiles/filesHandler';
import clearFileHandler from '../modules/uploadFiles/clearFileHandler';
const router = express.Router();

router.post(
    '/files',
    express.urlencoded({ extended: true }),
    uploadFile,
    (req, res) => {
        res.status(200).send(req.body);
    }
);
router.post(
    '/images',
    (req, res, next) => {
        console.log('images');
        next();
    },
    express.urlencoded({ extended: true }),
    uploadProductImage,
    resizeImage,
    (req, res) => {
        res.status(200).send(req.body);
    }
);

router.delete('/clear', clearFileHandler);

export default router;
