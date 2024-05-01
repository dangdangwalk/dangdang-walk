import { Test, TestingModule } from '@nestjs/testing';
import { HomeScreenService } from './home-screen.service';

describe('HomeScreenService', () => {
  let service: HomeScreenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HomeScreenService],
    }).compile();

    service = module.get<HomeScreenService>(HomeScreenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
