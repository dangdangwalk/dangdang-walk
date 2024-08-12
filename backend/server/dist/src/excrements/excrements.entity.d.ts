import { Excrement } from './types/excrement.type';
import { Dogs } from '../dogs/dogs.entity';
import { Journals } from '../journals/journals.entity';
export declare class Excrements {
    id: number;
    journal: Journals;
    journalId: number;
    dog: Dogs;
    dogId: number;
    type: Excrement;
    coordinate: string;
    constructor(entityData: Partial<Excrements>);
}
