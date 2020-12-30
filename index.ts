import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { SERVER_PORT, WHITE_LIST } from './config';
import routers from './routers';
import errorHandler from './modules/errorCollector/errorHandler';
dotenv.config();
// rest of the code remains same

const app = express();
const whitelist = WHITE_LIST.split(',');
const corsOptions = {
    origin: function (origin, callback) {
        if (
            whitelist.indexOf(origin) !== -1 ||
            !origin ||
            origin.indexOf('vscode-webview') == 0
        ) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

app.use(cors(corsOptions));

routers(app);
// error should handle after regular routers
app.use(errorHandler);
app.listen(SERVER_PORT, () => {
    console.log(
        `⚡️[server]: Server is running at http://localhost:${SERVER_PORT}`
    );
});
