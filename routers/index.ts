import express from 'express';
import {
    uploadProductImage,
    resizeImage,
} from '../modules/uploadFiles/imagesHandler';
import { uploadFile } from '../modules/uploadFiles/filesHandler';
const router = express.Router();

router.post('/files', uploadFile, (req, res) => {
    console.log(req.body);
    res.send(req.body);
});
router.post('/images', uploadProductImage, resizeImage, (req, res) => {
    res.send(req.body);
});

export default router;
