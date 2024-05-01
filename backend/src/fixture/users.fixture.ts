import { Users } from '../users/users.entity';
import { Role } from '../users/user-roles.enum';

const ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY2ODc1NzUzNCwiZXhwIjoxNjY4ODQzOTM0fQ.fwjmKJZ7enTKt7tPfNx-ZG_rczvhkz2ktMV5pDNbxkw';
const REFRESH_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY5OTU2MjQxLCJleHAiOjE2NzE3NTYyNDF9.8Nzxs_ev8bhq9bkrAc-nBV9YBTDIxajK3pwwPY5LMRM';
const OAUTH_REFRESH_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY5OTU2MjQxLCJleHAiOjE2NzE3NTYyNDF9.8Nzxs_ev8bhq9bkrAc-nBV9YBTDIxajK3pwwPY5LMRM';

export const mockUser = Users.create(
    1,
    '오징어1234',
    Role.User,
    1,
    '1',
    ACCESS_TOKEN,
    OAUTH_REFRESH_TOKEN,
    REFRESH_TOKEN,
    new Date('2019-01-01')
);
