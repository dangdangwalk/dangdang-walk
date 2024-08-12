import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
export default class BreedSeeder implements Seeder {
    run(dataSource: DataSource): Promise<any>;
}
