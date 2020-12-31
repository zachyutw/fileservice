import express from 'express';

export default function (req: express.Request): string {
    return `${req.protocol}://${req.get('host')}`;
}
