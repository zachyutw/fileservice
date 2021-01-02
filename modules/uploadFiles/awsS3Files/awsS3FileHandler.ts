import AWS from 'aws-sdk';
import multer from 'multer';
import path from 'path';
import { S3_BUCKET } from '../../../config';
AWS.config.update({ region: 'ap-northeast-2' });
const FILES_STORAGE_DESTINATION_PATH = path.join('assets', 'files');
const s3 = new AWS.S3({ apiVersion: '2020-12-31' });
// s3.listBuckets((err, data) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('success', data.Buckets);
//     }
// });

const multerStorage = multer.memoryStorage();

export const multerS3Files = multer({
    storage: multerStorage,
}).fields([{ name: 'files' }]);

export const uploadFilesToS3 = async (req, res, next) => {
    const userId = req.body.userId || req.query.userId || 'default';

    const files = await Promise.all(
        req.files.files.map(async (file) => {
            const { originalname, buffer } = file;
            const destination = path.join(
                FILES_STORAGE_DESTINATION_PATH,
                userId,
                originalname
            );
            return await s3
                .upload({
                    Bucket: S3_BUCKET,
                    Body: buffer,
                    Key: destination,
                })
                .promise()
                .then((data) => {
                    // after uploaded success, deleted file buffer
                    delete file.buffer;
                    const uploadedFile = Object.assign(file, data);
                    uploadedFile.url = data.Location;
                    uploadedFile.destination = destination;
                    return uploadedFile;
                })
                .catch((err) => {
                    throw new Error(err.message);
                });
        })
    );

    console.log(files);
    req.body.files = files;
    next();
};
