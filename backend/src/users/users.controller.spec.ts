import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { WinstonLoggerService } from 'src/common/logger/winstonLogger.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [WinstonLoggerService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
