import { AuthService } from './auth.service';
import { OauthAuthorizeDto } from './dtos/oauth-authorize.dto';
import { OauthDto } from './dtos/oauth.dto';
import { AccessTokenPayload, RefreshTokenPayload } from './token/token.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(
        oauthAuthorizeDTO: OauthAuthorizeDto,
    ): Promise<import('./types/auth-data.type').AuthData | import('./types/oauth-data.type').OauthData | undefined>;
    signup(oauthDTO: OauthDto): Promise<import('./types/auth-data.type').AuthData>;
    logout(user: AccessTokenPayload): Promise<void>;
    token(user: RefreshTokenPayload): Promise<import('./types/auth-data.type').AuthData>;
    deactivate(user: AccessTokenPayload): Promise<void>;
}
