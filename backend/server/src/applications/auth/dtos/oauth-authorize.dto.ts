import { IsIn, IsNotEmpty, IsString } from 'class-validator';

import { OAUTH_PROVIDERS, OauthProvider } from '../types/oauth-provider.type';

export class OauthAuthorizeDto {
    @IsString()
    @IsNotEmpty()
    authorizeCode: string;

    @IsString()
    @IsIn(OAUTH_PROVIDERS)
    @IsNotEmpty()
    provider: OauthProvider;
}
