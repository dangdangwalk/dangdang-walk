import { Breed } from './breed.entity';

describe('Breed', () => {
    it('breed 정보가 주어지면 breed 정보를 리턴해야 한다.', () => {
        const breed = new Breed();
        breed.id = 1;
        breed.name = '골드리트리버';
        breed.activity = 1;

        expect(breed.id).toEqual(1);
        expect(breed.name).toEqual('골드리트리버');
        expect(breed.activity).toEqual(1);
    });

    it('breed 정보가 없으면 빈 객체를 리턴해야 한다.', () => {
        const breed = new Breed();

        expect(breed).toEqual({});
    });
});
