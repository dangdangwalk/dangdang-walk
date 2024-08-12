"use strict";
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return BreedSeeder;
    }
});
const _nodefs = require("node:fs");
const _breedentity = require("../../../breed/breed.entity");
const _ansiutil = require("../../../utils/ansi.util");
const _winstonLoggerservice = require("../../logger/winstonLogger.service");
let BreedSeeder = class BreedSeeder {
    async run(dataSource) {
        const repository = dataSource.getRepository(_breedentity.Breed);
        const jsonData = _nodefs.readFileSync('./resources/breedData.json', 'utf-8');
        const breeds = JSON.parse(jsonData);
        await repository.query('SET FOREIGN_KEY_CHECKS = 0;');
        await repository.clear();
        await repository.query('SET FOREIGN_KEY_CHECKS = 1;');
        await repository.insert(breeds);
        const logger = new _winstonLoggerservice.WinstonLoggerService();
        logger.log(`${(0, _ansiutil.color)(breeds.length, 'Yellow')} rows inserted into breed table.`);
    }
};

//# sourceMappingURL=breed.seeder.js.map