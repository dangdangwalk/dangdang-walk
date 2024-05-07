import { DogWalkDay } from './dog-walk-day.entity';

describe('DogWalkDay', () => {
  it('DogWalkDay 정보가 주어지면 dogWalkDay 정보를 리턴해야 한다.', () => {
    const dogWalkDay= new DogWalkDay();
    dogWalkDay.mon = 2;
    dogWalkDay.tue = 3;
    dogWalkDay.wed = 2;
    dogWalkDay.thr = 5;
    dogWalkDay.fri = 2;
    dogWalkDay.sat = 3;
    dogWalkDay.sun = 2;

    expect(dogWalkDay.mon).toEqual(2);
    expect(dogWalkDay.tue).toEqual(3);
    expect(dogWalkDay.wed).toEqual(2);
    expect(dogWalkDay.thr).toEqual(5);
    expect(dogWalkDay.fri).toEqual(2);
    expect(dogWalkDay.sat).toEqual(3);
    expect(dogWalkDay.sun).toEqual(2);
  });
});
