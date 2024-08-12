export declare const ROLE: {
    readonly Admin: 'ADMIN';
    readonly User: 'USER';
};
export type Role = (typeof ROLE)[keyof typeof ROLE];
