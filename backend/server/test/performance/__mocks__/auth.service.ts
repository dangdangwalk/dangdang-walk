import * as jwt from 'server/src/node_modules/@types/jsonwebtoken';

import { AuthService } from '../../../src/auth/auth.service';
import { RefreshTokenPayload } from '../../../src/auth/token/token.service';

export class MockAuthService extends AuthService {
    async validateRefreshToken(token: string) {
        return jwt.verify(token, process.env.JWT_SECRET!) as RefreshTokenPayload;
    }
}
