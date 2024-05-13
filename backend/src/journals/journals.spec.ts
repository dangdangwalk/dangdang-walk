import { Journals } from './journals.entity';

describe('Journals', () => {
  it('journals가 주어지면 journals 정보를 리턴해야 한다. ', () => {
    const journals = new Journals({ id : 1, userId : 1, title: '오늘 하루 일지'});

    expect(journals.id).toEqual(1);
    expect(journals.userId).toEqual(1);
    expect(journals.title).toEqual('오늘 하루 일지');
  });
});
