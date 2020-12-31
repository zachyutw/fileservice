import path from 'path';
import { ROOT_PATH } from '../../../config';

type NamingFiles = {
    fileDomain: string;
    destinationPath: string;
    user: string;
    type?: string;
};

type NamedUrlAndPath = {
    fileUrl: string;
    uploadPath: string;
    fileDestination: string;
};

function namingFiles(config: NamingFiles): NamedUrlAndPath {
    const { fileDomain, destinationPath, user = 'default', type } = config;
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = `${today.getMonth() + 1}`.padStart(2, '0');

    const fileUrl = `${fileDomain || ''}/${path.join(
        destinationPath,
        year,
        month
    )}`;

    let uploadPath = path.join(ROOT_PATH, destinationPath, user);
    let fileDestination = path
        .join(ROOT_PATH, destinationPath, user)
        .replace(ROOT_PATH, '');

    if (type === 'gallery') {
        uploadPath = path.join(uploadPath, year, month);
        fileDestination = path.join(fileDestination, year, month);
    }

    return {
        fileUrl,
        uploadPath,
        fileDestination,
    };
}

export default namingFiles;
