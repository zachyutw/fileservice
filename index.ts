import express from 'express';
import path from 'path';
import * as dotenv from 'dotenv';

import {
    uploadProductImage,
    resizeImage,
} from './modules/uploadFiles/imagesHandler';
import { ROOT_PATH, SERVER_PORT } from './config';
dotenv.config();
// rest of the code remains same

const app = express();

app.post('/files', uploadProductImage, resizeImage, (req, res) => {
    console.log(req.body);
    res.send({
        cover: (req as any).body.cover,
        gallery: req.body.gallery,
    });
});
app.get('/assets/images/:filename', (req, res) =>
    res.download(path.join(ROOT_PATH, 'assets', 'images', req.params.filename))
);
app.get('/', (req, res) => res.send('Express + TypeScript Server'));

app.listen(SERVER_PORT, () => {
    console.log(
        `⚡️[server]: Server is running at http://localhost:${SERVER_PORT}`
    );
});
