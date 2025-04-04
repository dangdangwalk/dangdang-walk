import * as fs from 'node:fs';

import { Breed } from 'applications/breed';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { WinstonLoggerService } from '../logger/winstonLogger.service';
import { color } from '../utils/ansi.util';

export default class BreedSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const repository = dataSource.getRepository(Breed);

        const jsonData = fs.readFileSync('./resources/breedData.json', 'utf-8');
        const breeds = JSON.parse(jsonData);

        await repository.query('SET FOREIGN_KEY_CHECKS = 0;');
        await repository.clear();
        await repository.query('SET FOREIGN_KEY_CHECKS = 1;');
        await repository.insert(breeds);

        const logger = new WinstonLoggerService();
        logger.log(`${color(breeds.length, 'Yellow')} rows inserted into breed table.`);
    }
}
