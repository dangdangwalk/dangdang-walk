import { Response } from 'express';

export interface OAuthController {
    authorize(response: Response): void;
    callback(code: string, response: Response, error: string, error_description?: string): Promise<void>;
}
