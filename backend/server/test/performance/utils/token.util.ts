import * as dotenv from 'dotenv';
import * as jwt from 'server/src/node_modules/@types/jsonwebtoken';

import { AccessTokenPayload, RefreshTokenPayload } from '../../../src/auth/token/token.service';
import { OauthProvider } from '../../../src/auth/types/oauth-provider.type';

dotenv.config({ path: '.env.test' });

const signTestAccessToken = (
    userId: number = 1,
    provider: OauthProvider = 'kakao',
    expiresIn: string | number = '100y',
) => {
    console.log(`userId=${userId}, provider=${provider}, expiresIn=${expiresIn}`);

    const payload: AccessTokenPayload = {
        userId,
        provider,
    };

    const testAccessToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn });
    console.log(`> test access token: ${testAccessToken}\n`);
};

const signTestRefreshToken = (
    oauthId: string = '1',
    provider: OauthProvider = 'kakao',
    expiresIn: string | number = '100y',
) => {
    console.log(`oauthId=${oauthId}, provider=${provider}, expiresIn=${expiresIn}`);

    const payload: RefreshTokenPayload = {
        oauthId,
        provider,
    };

    const testRefreshToken = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn });
    console.log(`> test refresh token: ${testRefreshToken}\n`);
};

/**
 * 사용 예시
 * $ ts-node './test/performance/utils/token.util.ts' userId=1 oauthId=1 provider=kakao expiresIn=100y
 */
const args = process.argv.slice(2).reduce(
    (acc, arg) => {
        const [key, value] = arg.split('=');
        acc[key] = value;
        return acc;
    },
    {} as { [key: string]: string },
);

const { userId, oauthId, provider, expiresIn } = args;
console.log(`args=${JSON.stringify(args)}\n`);

signTestAccessToken(userId ? parseInt(userId) : undefined, provider as OauthProvider, expiresIn);
signTestRefreshToken(oauthId, provider as OauthProvider, expiresIn);
