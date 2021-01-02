import express from 'express';
import {
    uploadProductImage,
    resizeImage,
    uploadImageBuffer,
    waterMarkImages,
} from '../modules/uploadFiles/localFiles/imagesHandler';
import { uploadFile } from '../modules/uploadFiles/localFiles/filesHandler';
import clearFileHandler from '../modules/uploadFiles/localFiles/clearFileHandler';
import {
    multerS3Files,
    uploadFilesToS3,
} from '../modules/uploadFiles/awsS3Files/awsS3FileHandler';
const router = express.Router();

router.post(
    '/files/s3',
    express.urlencoded({ extended: true }),
    multerS3Files,
    uploadFilesToS3,
    (req, res) => {
        res.status(200).send({ message: 'success' });
    }
);
router.post(
    '/images',
    express.urlencoded({ extended: true }),
    uploadImageBuffer,
    waterMarkImages({ type: 'buffer' }),
    (req, res) => {
        console.log(req.files);
        res.status(200).send({ message: 'success' });
    }
);
router.post(
    '/files',
    express.urlencoded({ extended: true }),
    uploadFile,
    (req, res) => {
        res.status(200).send(req.body);
    }
);

// router.post(
//     '/images',
//     express.urlencoded({ extended: true }),
//     uploadProductImage,
//     resizeImage,
//     (req, res) => {
//         res.status(200).send(req.body);
//     }
// );

router.delete('/clear', clearFileHandler);

export default router;
