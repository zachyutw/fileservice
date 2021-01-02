import path from 'path';

export default function getYYYYMMPath() {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = `${today.getMonth() + 1}`.padStart(2, '0');
    return path.join(year, month);
}
