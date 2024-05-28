export const GENDER = {
    Male: 'MALE',
    Female: 'FEMALE',
} as const;

export type Gender = (typeof GENDER)[keyof typeof GENDER];
