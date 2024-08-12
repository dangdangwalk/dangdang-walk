export const ROLE = {
    Admin: 'ADMIN',
    User: 'USER',
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];
