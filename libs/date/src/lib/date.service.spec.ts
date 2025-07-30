import { Test } from '@nestjs/testing';
import { BackendDateService } from './date.service';

describe('BackendDateService', () => {
  let service: BackendDateService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [BackendDateService],
    }).compile();

    service = module.get(BackendDateService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
