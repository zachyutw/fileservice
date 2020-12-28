import express from 'express';
import path from 'path';
import * as dotenv from 'dotenv';

import {
    uploadProductImage,
    resizeImage,
} from './modules/uploadFiles/imagesHandler';
import { uploadFile } from './modules/uploadFiles/filesHandler';
import { ROOT_PATH, SERVER_PORT } from './config';
dotenv.config();
// rest of the code remains same

const app = express();

app.post('/files', uploadFile, (req, res) => {
    console.log(req.body);
    res.send(req.body);
});
app.post('/images', uploadProductImage, resizeImage, (req, res) => {
    res.send(req.body);
});
app.get('/download/*', (req, res) => {
    return res.download(
        path.join(ROOT_PATH, req.originalUrl.replace('download', 'assets'))
    );
});
app.use('/assets', express.static(path.join(ROOT_PATH, 'assets')));

app.get('/', (req, res) => res.send('Image Upload Server'));

app.listen(SERVER_PORT, () => {
    console.log(
        `⚡️[server]: Server is running at http://localhost:${SERVER_PORT}`
    );
});
