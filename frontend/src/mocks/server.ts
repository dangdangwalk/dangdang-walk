import { setupServer } from 'msw/node';
import { handlers } from '@/mocks/handler';

export const server = setupServer(...handlers);
