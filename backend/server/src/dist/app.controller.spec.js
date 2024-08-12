"use strict";
const _testing = require("@nestjs/testing");
const _appcontroller = require("./app.controller");
describe('AppController', ()=>{
    let appController;
    beforeEach(async ()=>{
        const app = await _testing.Test.createTestingModule({
            controllers: [
                _appcontroller.AppController
            ]
        }).compile();
        appController = app.get(_appcontroller.AppController);
    });
    describe('root', ()=>{
        it('should return "Hello World!"', ()=>{
            expect(appController.getHello()).toBe('Hello World!');
        });
    });
});

//# sourceMappingURL=app.controller.spec.js.map