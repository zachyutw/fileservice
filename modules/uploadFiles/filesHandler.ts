import path from 'path';
import { ROOT_PATH, SERVER_DOMAIN } from '../../config';
import multer from 'multer';
import namingFiles from './utils/namingFiles';
import mkdirp from 'mkdirp';

const FILES_STORAGE_DESTINATION_PATH = path.join(ROOT_PATH, 'assets', 'files');
const MAX_SIZE = 1 * 1000 * 1000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { uploadPath } = namingFiles(
            ROOT_PATH,
            SERVER_DOMAIN,
            FILES_STORAGE_DESTINATION_PATH
        );
        mkdirp(uploadPath).then(() => cb(null, uploadPath));
    },
    filename: (req, file, cb) =>
        cb(null, `${req.query.prefix || ''}${file.originalname}`),
});

const upload = multer({ storage, limits: { fieldSize: MAX_SIZE } }).array(
    'files'
);

export const uploadFile = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            res.send(err);
        } else {
            const { uploadPath } = namingFiles(
                ROOT_PATH,
                SERVER_DOMAIN,
                FILES_STORAGE_DESTINATION_PATH
            );
            console.log(uploadPath);
            const files = (req.files as any[]).map((file) =>
                file.path.replace(ROOT_PATH, process.env.SERVER_DOMAIN)
            );
            req.body.files = files;
            next();
        }
    });
};

export default uploadFile;
