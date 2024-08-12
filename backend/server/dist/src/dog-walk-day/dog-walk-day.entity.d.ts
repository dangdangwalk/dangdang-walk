export declare class DogWalkDay {
    id: number;
    mon: number;
    tue: number;
    wed: number;
    thr: number;
    fri: number;
    sat: number;
    sun: number;
    updatedAt: Date;
    constructor(entityData: Partial<DogWalkDay>);
    [key: string]: number | Date;
}
