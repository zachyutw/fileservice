import path from 'path';
import { ROOT_PATH } from '../../../config';
import multer from 'multer';
import getBaseUrl from '../../../utils/getBaseUrl';
import mkdirp from 'mkdirp';

const FILES_STORAGE_DESTINATION_PATH = path.join('assets', 'files');
const MAX_SIZE = 1 * 1000 * 1000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.body.userId || req.query.userId;
        const uploadPath = path.join(
            ROOT_PATH,
            FILES_STORAGE_DESTINATION_PATH,
            userId
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
            const files = (req.files as any[]).map((file) => {
                //assign domain to file url
                const serverDomainFileUrl = file.path.replace(
                    ROOT_PATH,
                    getBaseUrl(req)
                );
                const serverDomainFilePath = file.path.replace(ROOT_PATH, '');
                file.path = serverDomainFilePath;
                file.destination = serverDomainFilePath;
                file.url = serverDomainFileUrl;
                return file;
            });
            req.body.files = files;
            next();
        }
    });
};

export default uploadFile;
