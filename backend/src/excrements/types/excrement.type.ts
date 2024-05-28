export const EXCREMENT = {
    Feces: 'FECES',
    Urine: 'URINE',
} as const;

export type Excrement = (typeof EXCREMENT)[keyof typeof EXCREMENT];
