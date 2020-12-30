import uploadRoute from './upload.route';
import express from 'express';
import path from 'path';
import { ROOT_PATH } from '../config';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';

export default function (app: express.Application) {
    app.use('/upload', uploadRoute);
    app.get('/download/*', (req, res) => {
        return res.download(
            path.join(ROOT_PATH, req.originalUrl.replace('download', 'assets'))
        );
    });
    app.use('/assets', express.static(path.join(ROOT_PATH, 'assets')));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use('/clear', () => {});
    app.get('/', (req, res) =>
        res.sendFile(path.join(ROOT_PATH, 'index.html'))
    );
}
