"use strict";
const _journalsentity = require("./journals.entity");
describe('Journals', ()=>{
    it('journals가 주어지면 journals 정보를 반환해야 한다.', ()=>{
        const journals = new _journalsentity.Journals({
            id: 1,
            userId: 1,
            calories: 11
        });
        expect(journals.id).toBe(1);
        expect(journals.userId).toBe(1);
        expect(journals.calories).toBe(11);
    });
    it('journals 정보가 없으면 빈 객체를 반환해야 한다.', ()=>{
        const journals = new _journalsentity.Journals({});
        expect(journals).toEqual({});
    });
});

//# sourceMappingURL=journals.spec.js.map