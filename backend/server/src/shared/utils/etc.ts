import * as path from 'path';

export const isProduction = process.env.NODE_ENV === 'prod';

export const isTest = process.env.NODE_ENV === 'test';

export const directory = path.join(process.cwd(), 'log');

export const EVENTS = {
    JOURNAL_CREATED: 'journal.created',
    JOURNAL_DELETED: 'journal.deleted',
    DOG_CREATED: 'dog.created',
    DOG_UPDATED: 'dog.updated',
    DOG_DELETED: 'dog.deleted',
} as const;

export const CACHE_TTL = 1000 * 60 * 60;
