export declare const EXCREMENT: {
    readonly Feces: 'FECES';
    readonly Urine: 'URINE';
};
export type Excrement = (typeof EXCREMENT)[keyof typeof EXCREMENT];
