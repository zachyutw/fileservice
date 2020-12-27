import path from 'path';
import { ROOT_PATH } from '../../config';
import multer from 'multer';
import MulterSharpResizer from 'multer-sharp-resizer';

const IMAGES_STORAGE_DESTINATION_PATH = path.join(
    ROOT_PATH,
    'assets',
    'images'
);
const MAX_SIZE = 1 * 1000 * 1000;

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const multerStorage = multer.memoryStorage();

export const uploadProductImage = multer({
    storage: multerStorage,
    limits: { fieldSize: MAX_SIZE },
    fileFilter,
}).fields([
    { name: 'cover', maxCount: 2 },
    { name: 'gallery', maxCount: 4 },
]);

export const resizeImage = async (req, res, next) => {
    const filename = `gallery-${Date.now()}.jpeg`;
    const today = new Date();
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1}`.padStart(2, '0');
    const fileUrl = `${req.protocol}://${req.get(
        'host'
    )}/uploads/${year}/${month}`;
    const uploadPath = `${IMAGES_STORAGE_DESTINATION_PATH}/${year}/${month}`;
    const sizes = [
        {
            path: 'original',
            width: null,
            height: null,
        },
        {
            path: 'large',
            width: 800,
            height: 800,
        },
        {
            path: 'medium',
            width: 300,
            height: 300,
        },
        {
            path: 'thumbnail',
            width: 100,
            height: 100,
        },
    ];
    // sharp options
    const sharpOptions = {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255 },
    };

    const resizeObj = new MulterSharpResizer(
        req,
        filename,
        sizes,
        uploadPath,
        fileUrl,
        sharpOptions
    );

    await resizeObj.resize();
    const getDataUploaded = resizeObj.getData();

    // Get details of uploaded files: Used by multer fields
    req.body.cover = getDataUploaded.cover;
    req.body.gallery = getDataUploaded.gallery;
    next();
};
