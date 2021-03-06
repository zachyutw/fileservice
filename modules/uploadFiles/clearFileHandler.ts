import fs from 'fs';
import path from 'path';
import { ROOT_PATH } from '../../config';

const clearFileHandler = (req, res, next) => {
    const { directory } = req.query;
    fs.rmdir(
        path.join(ROOT_PATH, 'assets', directory),
        { recursive: true },
        (err) => {
            if (err) {
                next(new Error(err.message));
            } else {
                return res.send({ message: 'clear assets success' });
            }
        }
    );
};

export default clearFileHandler;
