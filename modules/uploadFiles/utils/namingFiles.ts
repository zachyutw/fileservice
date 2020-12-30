import path from 'path';
import { ROOT_PATH } from '../../../config';

const namingFiles: (
    rootPath: string,
    fileDomain: string,
    destinationPath: string,
    user: string
) => { fileUrl: string; uploadPath: string } = (
    rootPath,
    fileDomain,
    destinationPath,
    user = 'default'
) => {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = `${today.getMonth() + 1}`.padStart(2, '0');

    const fileUrl = `${fileDomain || ''}/${path.join(
        destinationPath,
        year,
        month
    )}`;
    const uploadPath = path.join(rootPath, destinationPath, user, year, month);
    const fileDestination = path
        .join(rootPath, destinationPath, user, year, month)
        .replace(ROOT_PATH, '');

    return {
        fileUrl,
        uploadPath,
        fileDestination,
    };
};

export default namingFiles;
