import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../entities/categories.entity';
import { CategoriesService } from './categories.service';
import { mockRepository } from './mocks/category-mock.spec';

describe('CategoriesService', () => {
  let service: CategoriesService;
  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [CategoriesService,{provide:getRepositoryToken(Category), useValue: mockRepository}],
    }).compile();

    service = app.get<CategoriesService>(CategoriesService);
  });

  describe('create', () => {
    it('should return "Hello API"', () => {
      expect(service.create({})).toEqual({ message: 'Hello API' });
    });
  });
});