import { RpcException } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { KafkaResponse } from '../../common/kafka-reponse.interface';
import { CreateCategorieDTO } from '../controllers/dto/create.dto';
import { Category } from '../entities/categories.entity';
import { CategoriesService } from './categories.service';
import { mockRepository } from './mocks/category.mock.spec';

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-09-12T18:28:34.375Z'));
    const app = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = app.get<CategoriesService>(CategoriesService);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const categoryDto: CreateCategorieDTO = {
        name: 'New Category',
        slug: 'new-category',
        color: '#FF0000',
      };
  
      const createdCategory = {
        uuid: 'UUID',
        name: categoryDto.name,
        slug: categoryDto.slug,
        color: categoryDto.color,
        parent: null,
      };
      const createdCategoryResponse: KafkaResponse<Category> = {
        status: 'success',
        timestamp: new Date(),
        data: createdCategory,
      };
  
      jest.spyOn(service['categoryRepo'], 'create').mockReturnValue(createdCategory);
      jest.spyOn(service['categoryRepo'], 'save').mockResolvedValue(createdCategory);
  
      const result = await service.create(categoryDto);
  
      expect(result).toEqual(createdCategoryResponse);
      expect(service['categoryRepo'].create).toHaveBeenCalledWith({
        name: categoryDto.name,
        parent: null,
        slug: categoryDto.slug,
        color: categoryDto.color,
      });
      expect(service['categoryRepo'].save).toHaveBeenCalledWith(
        createdCategory
      );
    });
  
    it('should create a new subcategory', async () => {
      const categoryDto: CreateCategorieDTO = {
        name: 'New Category',
        slug: 'new-category',
        color: '#FF0000',
        parentUuid: 'parent-uuid',
      };
  
      const parentCategory = {
        uuid: 'parent-uuid',
        name: 'Parent Category',
        slug: 'parent-category',
        color: '#00FF00',
        parent: null,
      };
  
      const createdCategory = {
        uuid: 'UUID',
        name: categoryDto.name,
        slug: categoryDto.slug,
        color: categoryDto.color,
        parent: parentCategory,
      };
  
      const createdCategoryResponse: KafkaResponse<Category> = {
        status: 'success',
        timestamp: new Date(),
        data: createdCategory,
      };
  
      jest.spyOn(service['categoryRepo'], 'findOne').mockResolvedValue(parentCategory);
      jest.spyOn(service['categoryRepo'], 'create').mockReturnValue(createdCategory);
      jest.spyOn(service['categoryRepo'], 'save').mockResolvedValue(createdCategory);
  
      const result = await service.create(categoryDto);
  
      expect(result).toEqual(createdCategoryResponse);
      expect(service['categoryRepo'].findOne).toHaveBeenCalledWith({
        where: { uuid: categoryDto.parentUuid },
      });
      expect(service['categoryRepo'].create).toHaveBeenCalledWith(
        {
          name: categoryDto.name,
          parent: parentCategory,
          slug: categoryDto.slug,
          color: categoryDto.color,
        }
      );
      expect(service['categoryRepo'].save).toHaveBeenCalledWith(
        createdCategory
      );
    });
    it('should throw an error if the parent category is not found', async () => {
      const categoryDto: CreateCategorieDTO = {
        name: 'New Category',
        slug: 'new-category',
        color: '#FF0000',
        parentUuid: 'non-existing-parent-uuid',
      };

      jest.spyOn(service['categoryRepo'], 'findOne').mockResolvedValue(null);

      await expect(service.create(categoryDto)).rejects.toThrow(RpcException);

      expect(service['categoryRepo'].findOne).toHaveBeenCalledWith({
        where: { uuid: categoryDto.parentUuid },
      });
      expect(service['categoryRepo'].create).not.toHaveBeenCalled();
      expect(service['categoryRepo'].save).not.toHaveBeenCalled();
    });

    it('should throw an error if the parent category has a parent', async () => {
      const categoryDto = {
        name: 'New Category',
        slug: 'new-category',
        color: '#FF0000',
        parentUuid: 'existing-parent-uuid',
      };

      const parentCategory = {
        uuid: 'existing-parent-uuid',
        name: 'Existing Parent',
        slug: 'existing-parent',
        color: '#00FF00',
        parent: { uuid: 'grandparent-uuid', name: 'Grandparent', slug: 'grandparent' },
      };

      jest
        .spyOn(service['categoryRepo'], 'findOne')
        .mockResolvedValue(parentCategory);

      await expect(service.create(categoryDto)).rejects.toThrow(RpcException);
      expect(service['categoryRepo'].findOne).toHaveBeenCalledWith({
        where: { uuid: categoryDto.parentUuid },
      });
      expect(service['categoryRepo'].create).not.toHaveBeenCalled();
      expect(service['categoryRepo'].save).not.toHaveBeenCalled();
    });

    it('should throw an error if an error occurs while creating the category', async () => {
      const categoryDto = {
        name: 'New Category',
        slug: 'new-category',
        color: '#FF0000',
      };
      jest
        .spyOn(service['categoryRepo'], 'create')
        .mockReturnValue({
          name: categoryDto.name,
          uuid: 'UUID',
          slug: categoryDto.slug,
        });
      jest
        .spyOn(service['categoryRepo'], 'save')
        .mockRejectedValue(new Error('An error occurred'));

      await expect(service.create(categoryDto)).rejects.toThrow(RpcException);
      expect(service['categoryRepo'].create).toHaveBeenCalledWith({
        name: categoryDto.name,
        parent: null,
        slug: categoryDto.slug,
        color: categoryDto.color,
      });
      expect(service['categoryRepo'].save).toHaveBeenCalledWith({
        name: categoryDto.name,
        uuid: 'UUID',
        slug: categoryDto.slug,
      });
    });
  });

  describe('find', () => {

    let service: CategoriesService;
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
    beforeAll(async () => {
    
      const app = await Test.createTestingModule({
        providers: [
          CategoriesService,
          {
            provide: getRepositoryToken(Category),
            useValue: mockRepository,
          },
        ],
      }).compile();
  
      service = app.get<CategoriesService>(CategoriesService);
    });
  
  
  
    it('should return an array of categories', async () => {
      const categories = [
        { uuid: 'UUID', name: 'Category 1', slug: 'category-1', color: '#FF0000' },
        { uuid: 'UUID', name: 'Category 2', slug: 'category-2', color: '#00FF00' },
      ];
      jest.spyOn(service['categoryRepo'], 'find').mockResolvedValue(categories);
      const result = await service.find();
      expect(result).toEqual(categories);
    });
  
    it('should return an empty array if no categories found', async () => {
      jest.spyOn(service['categoryRepo'], 'find').mockResolvedValue([]);
      const result = await service.find();
      expect(result).toEqual([]);
    });
  });
  
  
  describe('findOne', () => {
  
    let service: CategoriesService;
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
    beforeAll(async () => {
    
      const app = await Test.createTestingModule({
        providers: [
          CategoriesService,
          {
            provide: getRepositoryToken(Category),
            useValue: mockRepository,
          },
        ],
      }).compile();
  
      service = app.get<CategoriesService>(CategoriesService);
    });
  
  
  
    it('should return a Object of categories', async () => {
      const category =    { uuid: 'UUID', name: 'Category 1', slug: 'category-1', color: '#FF0000' }
        
      ;
      jest.spyOn(service['categoryRepo'], 'findOne').mockResolvedValue(category);
      const result = await service.findById('UUID');
      expect(result).toEqual(category);
    });
  
    it('should return null if category not found', async () => {
      jest.spyOn(service['categoryRepo'], 'findOne').mockResolvedValue(null);
      const result = await service.findById('non-existing-uuid');
      expect(result).toBeNull();
    });
  });

});

