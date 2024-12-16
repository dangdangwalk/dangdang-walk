import { OAUTH_REGISTRY } from '../oauth/oauth.module';

export const OAUTH_PROVIDERS = [...OAUTH_REGISTRY.keys()] as const;

export type OauthProvider = (typeof OAUTH_PROVIDERS)[number];
