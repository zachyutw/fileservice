import path from 'path';
import express from 'express';
import { ROOT_PATH, WATER_MARK_LOGO } from '../../config';
import multer from 'multer';
import MulterSharpResizer from 'multer-sharp-resizer';
import namingFiles from './utils/namingFiles';
import Jimp from 'jimp';
import getBaseUrl from '../../utils/getBaseUrl';

const IMAGES_STORAGE_DESTINATION_PATH = path.join('assets', 'images');
const MAX_SIZE = 1 * 1000 * 1000;

const COVER_MAX_COUNT = 2;
const GALLERY_MAX_COUNT = 4;
const LOGO_MARGIN_PERCENTAGE = 5;

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only pdfs are allowed'), false);
    }
};

const multerStorage = multer.memoryStorage();

export const uploadProductImage = multer({
    storage: multerStorage,
    limits: { fieldSize: MAX_SIZE },
    fileFilter,
}).fields([
    { name: 'cover', maxCount: COVER_MAX_COUNT },
    { name: 'gallery', maxCount: GALLERY_MAX_COUNT },
]);

const watermarking = async (originalImage: string, logoImage: string) => {
    // console.log(originalImage);
    // const [image, logo] = await Promise.all([
    //     Jimp.read(originalImage),
    //     Jimp.read(LOGO),
    // ]);

    const logo = await Jimp.read(logoImage);
    const image = await Jimp.read(originalImage);

    // console.log(logo);
    logo.resize(image.bitmap.width / 10, Jimp.AUTO);

    const xMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
    const yMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;

    const X = image.bitmap.width - logo.bitmap.width - xMargin;
    const Y = image.bitmap.height - logo.bitmap.height - yMargin;

    return image.composite(logo, X, Y, {
        mode: Jimp.BLEND_MULTIPLY,
        opacitySource: 0.1,
        opacityDest: 1,
    });
};

export const resizeImage = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    try {
        const filename: string = `images-${Date.now()}.jpeg`;
        const userId = req.body.userId || req.query.userId;
        const { fileUrl, uploadPath } = namingFiles({
            fileDomain: getBaseUrl(req),
            destinationPath: IMAGES_STORAGE_DESTINATION_PATH,
            user: userId,
            type: 'gallery',
        });

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

        if (req.query.createWaterMark) {
            await Promise.all(
                Object.values(getDataUploaded)
                    .flat()
                    .map(async ({ originalname, ...rest }) => {
                        await Promise.all(
                            Object.values(rest).map(
                                async ({ path: imagePath }) => {
                                    const filePath: string = imagePath.replace(
                                        `${req.protocol}://${req.host}`,
                                        ROOT_PATH
                                    );
                                    await watermarking(
                                        filePath,
                                        (req.query.logoImage as string) ||
                                            WATER_MARK_LOGO
                                    ).then((image) => {
                                        image.write(filePath);
                                    });
                                }
                            )
                        );
                    })
            );
        }

        req.body.cover = getDataUploaded.cover;
        req.body.gallery = getDataUploaded.gallery;
        next();
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};
