import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

import { AccessTokenPayload, RefreshTokenPayload } from '../../../src/auth/token/token.service';
import { OauthProvider } from '../../../src/auth/types/oauth-provider.type';

dotenv.config({ path: '.env.test' });

const signTestAccessToken = (userId: number = 1, provider: OauthProvider = 'kakao') => {
    const payload: AccessTokenPayload = {
        userId,
        provider,
    };

    const testAccessToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '100y' });
    console.log('test access token:', testAccessToken);
};

const signTestRefreshToken = (oauthId: string = '1', provider: OauthProvider = 'kakao') => {
    const payload: RefreshTokenPayload = {
        oauthId,
        provider,
    };

    const testRefreshToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '100y' });
    console.log('test refresh token:', testRefreshToken);
};

/**
 * 사용 예시
 * $ ts-node './test/performance/utils/token.util.ts' userId=1 oauthId=1 provider=kakao
 */
const args = process.argv.slice(2).reduce(
    (acc, arg) => {
        const [key, value] = arg.split('=');
        acc[key] = value;
        return acc;
    },
    {} as { [key: string]: string },
);

const { userId, oauthId, provider } = args;
console.log(args);

if (userId) {
    signTestAccessToken(parseInt(userId), (provider as OauthProvider) || 'kakao');
}

if (oauthId) {
    signTestRefreshToken(oauthId, (provider as OauthProvider) || 'kakao');
}

if (!userId && !oauthId) {
    signTestAccessToken();
    signTestRefreshToken();
}
