import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { OAUTH_PROVIDERS, OauthProvider } from '../types/auth.type';

export class OAuthAuthorizeDTO {
    @IsString()
    @IsNotEmpty()
    authorizeCode: string;

    @IsString()
    @IsIn(OAUTH_PROVIDERS)
    @IsNotEmpty()
    provider: OauthProvider;
}
