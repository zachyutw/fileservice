import * as dotenv from 'dotenv';
dotenv.config();

export const ROOT_PATH = __dirname;
export const SERVER_PORT = process.env.PORT || 80;
export const SERVER_DOMAIN =
    process.env.SERVER_DOMAIN || 'http://localhost:8000';
export const WATER_MARK_LOGO =
    process.env.WATER_MARK_LOGO ||
    'https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/Australian_Defence_Force_Academy_coat_of_arms.svg/1200px-Australian_Defence_Force_Academy_coat_of_arms.svg.png';
export const WHITE_LIST = process.env.WHITE_LIST || 'http://localhost:18512';
