import { Excrements } from './excrements.entity';

describe('excrements', () => {
    it('excrements가 주어지면 excrements 정보를 반환해야 한다.', () => {
        const excrements = new Excrements({
            id: 1,
            journalId: 1,
            dogId: 1,
            type: 'URINE',
            coordinate: 'POINT(126.977948 37.566667)',
        });

        expect(excrements).toEqual({
            coordinate: 'POINT(126.977948 37.566667)',
            dog: undefined,
            dogId: 1,
            id: 1,
            journal: undefined,
            journalId: 1,
            type: 'URINE',
        });
    });

    it('excrements 정보가 없으면 빈 객체를 반환해야 한다.', () => {
        const excrements = new Excrements({});

        expect(excrements).toEqual({});
    });
});
