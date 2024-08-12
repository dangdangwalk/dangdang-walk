"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("node:fs");
const breed_entity_1 = require("../../../breed/breed.entity");
const ansi_util_1 = require("../../../utils/ansi.util");
const winstonLogger_service_1 = require("../../logger/winstonLogger.service");
class BreedSeeder {
    async run(dataSource) {
        const repository = dataSource.getRepository(breed_entity_1.Breed);
        const jsonData = fs.readFileSync('./resources/breedData.json', 'utf-8');
        const breeds = JSON.parse(jsonData);
        await repository.query('SET FOREIGN_KEY_CHECKS = 0;');
        await repository.clear();
        await repository.query('SET FOREIGN_KEY_CHECKS = 1;');
        await repository.insert(breeds);
        const logger = new winstonLogger_service_1.WinstonLoggerService();
        logger.log(`${(0, ansi_util_1.color)(breeds.length, 'Yellow')} rows inserted into breed table.`);
    }
}
exports.default = BreedSeeder;
//# sourceMappingURL=breed.seeder.js.map