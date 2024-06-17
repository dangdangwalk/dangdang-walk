// Access token with maxAge = 100 years, userId = 1, provider = kakao
export const VALID_ACCESS_TOKEN_100_YEARS =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInByb3ZpZGVyIjoia2FrYW8iLCJpYXQiOjE3MTYxODc5NzAsImV4cCI6NDg3MTk0Nzk3MH0.QlL_1luAr4T-YdA5QfKl8_ivhAlE1_FFlRfSAq2u2Lc';
// Access token with maxAge = 100 years, userId = 100, provider = kakao
export const INVALID_USER_ID_ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwMCwicHJvdmlkZXIiOiJrYWthbyIsImlhdCI6MTcxNzkzMTM5OCwiZXhwIjoxNzE3OTM0OTk4fQ.oLl9-M7qkDZNbMmcrCNhyMcQ2Eyxxy751Xo3pBjww_4';
export const EXPIRED_ACCESS_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInByb3ZpZGVyIjoia2FrYW8iLCJpYXQiOjE3MTc1OTQ4NTYsImV4cCI6MTcxNzU5NDg2Nn0.KphkJf-oCeJoZTv3fw-XvI5Qo16058r_ak5lWCJrvmg';
export const MALFORMED_ACCESS_TOKEN = 'malformed_access_token';

// Refresh token with maxAge = 100 years, oauthId = 12345, provider = kakao
export const VALID_REFRESH_TOKEN_100_YEARS =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvYXV0aElkIjoiMTIzNDUiLCJwcm92aWRlciI6Imtha2FvIiwiaWF0IjoxNzE3NjAwNzIzLCJleHAiOjQ4NzMzNjA3MjN9.4FVH0-mkQ_qf4J0lmdu9lBrTrOYNk13fy7TJSjyyPV4';
export const EXPIRED_REFRESH_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvYXV0aElkIjoiMTIzNDUiLCJwcm92aWRlciI6Imtha2FvIiwiaWF0IjoxNzE3NjAwNzczLCJleHAiOjE3MTc2MDA3Nzh9.ESo_BdU8g2K5YayZkkRPw5v6AKPJwx-p6R7_RA1QUvg';
export const MALFORMED_REFRESH_TOKEN = 'malformed_refresh_token';

export const VALID_PROVIDER_KAKAO = 'kakao';
export const INVALID_PROVIDER = 'invalid_provider';

export const AUTHORIZE_CODE = 'authorizeCode';
export const OAUTH_ACCESS_TOKEN = 'oauth_access_token';
export const OAUTH_REFRESH_TOKEN = 'oauth_refresh_token';
