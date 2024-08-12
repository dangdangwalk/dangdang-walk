import { InsertResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Excrements } from './excrements.entity';
import { ExcrementsRepository } from './excrements.repository';
export declare class ExcrementsService {
    private readonly excrementsRepository;
    constructor(excrementsRepository: ExcrementsRepository);
    insert(entity: QueryDeepPartialEntity<Excrements> | QueryDeepPartialEntity<Excrements>[]): Promise<InsertResult>;
    makeCoordinate(lat: number, lng: number): string;
}
