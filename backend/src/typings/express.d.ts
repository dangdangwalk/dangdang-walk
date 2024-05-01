import { Request as ExpressRequest } from 'express';

declare module 'express' {
    interface Request {
        session: {
            redirectUrl?: string;
        };
    }
}
