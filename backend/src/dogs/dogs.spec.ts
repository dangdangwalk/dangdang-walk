import { Dogs } from './dogs.entity';

describe('Dogs', () => {
    it('dogs 정보가 주어지면 dogs 정보를 리턴해야 한다.', () => {
        const dogs = new Dogs({ id: 1, name: '덕지', gender: 'MALE' });

        expect(dogs.id).toBe(1);
        expect(dogs.name).toBe('덕지');
        expect(dogs.gender).toBe('MALE');
    });

    it('dogs 정보가 없으면 빈 객체를 리턴해야 한다.', () => {
        const breed = new Dogs({});

        expect(breed).toEqual({});
    });
});
