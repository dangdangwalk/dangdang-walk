import { Users } from '../users/users.entity';
export declare class Journals {
    id: number;
    user: Users;
    userId: number;
    distance: number;
    calories: number;
    startedAt: Date;
    duration: number;
    journalPhotos: string;
    routes: string;
    memo: string;
    excrementCount: string;
    constructor(entityData: Partial<Journals>);
}
