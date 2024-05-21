import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { OAUTH_PROVIDERS, OauthProvider } from '../types/auth.type';

export class OauthAuthorizeDto {
    @IsString()
    @IsNotEmpty()
    authorizeCode: string;

    @IsString()
    @IsIn(OAUTH_PROVIDERS)
    @IsNotEmpty()
    provider: OauthProvider;
}

export class OauthDto {
    @IsString()
    @IsNotEmpty()
    oauthAccessToken: string;

    @IsString()
    @IsNotEmpty()
    oauthRefreshToken: string;

    @IsString()
    @IsIn(OAUTH_PROVIDERS)
    @IsNotEmpty()
    provider: OauthProvider;
}
