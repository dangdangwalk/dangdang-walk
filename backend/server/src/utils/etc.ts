import * as path from 'path';

export const isProduction = process.env.NODE_ENV === 'prod';

export const isTest = process.env.NODE_ENV === 'test';

export const directory = path.join(process.cwd(), 'log');
