import { Dogs } from './dogs.entity';

describe('Dogs', () => {
    it('dogs 정보가 주어지면 dogs 정보를 리턴해야 한다.', () => {
        const dogs = new Dogs({ id: 1, name: '덕지', gender: 'MALE' });

        expect(dogs.id).toEqual(1);
        expect(dogs.name).toEqual('덕지');
        expect(dogs.gender).toEqual('MALE');
    });

    it('dogs 정보가 없으면 빈 객체를 리턴해야 한다.', () => {
        const breed = new Dogs({});

        expect(breed).toEqual({});
    });
});
