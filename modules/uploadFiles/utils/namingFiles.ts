import path from 'path';

const namingFiles: (
    rootPath: string,
    fileDomain: string,
    destinationPath: string
) => { fileUrl: string; uploadPath: string } = (
    rootPath,
    fileDomain,
    destinationPath
) => {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = `${today.getMonth() + 1}`.padStart(2, '0');

    const fileUrl = `${fileDomain || ''}/${path.join(
        destinationPath,
        year,
        month
    )}`;
    const uploadPath = path.join(rootPath, destinationPath, year, month);
    return {
        fileUrl,
        uploadPath,
    };
};

export const namingFileUrl: (fileDomain: string) => string = (fileDomain) => {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = `${today.getMonth() + 1}`.padStart(2, '0');

    return path.join(fileDomain, 'uploads', year, month);
};
export const namingUploadPath: (destinationPath: string) => string = (
    destinationPath
) => {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = `${today.getMonth() + 1}`.padStart(2, '0');
    return path.join(destinationPath, year, month);
};

export default namingFiles;
