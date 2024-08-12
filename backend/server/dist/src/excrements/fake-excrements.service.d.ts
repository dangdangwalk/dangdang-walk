import { Excrements } from './excrements.entity';
import { ExcrementsRepository } from './excrements.repository';
import { ExcrementsService } from './excrements.service';
export declare class FakeExcrementsService extends ExcrementsService {
    constructor(excrementsRepository: ExcrementsRepository);
    createIfNotExists(data: Partial<Excrements>): Promise<Excrements>;
    makeCoordinate(lat: number, lng: number): string;
}
