import { TreeRepository } from "typeorm";
import { Category } from "../../entities/categories.entity";

// Mock del repositorio con métodos básicos y de árbol
export const mockRepository: Partial<TreeRepository<Category>> = {
  // Métodos estándar
  create: jest.fn().mockImplementation(dto => dto),
  save: jest.fn().mockImplementation(entity => Promise.resolve(entity)),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
  
  // Métodos específicos de árbol (nested-set)
  findTrees: jest.fn().mockResolvedValue([]),

  findDescendantsTree: jest.fn(),
  findAncestorsTree: jest.fn(),
  findRoots: jest.fn().mockResolvedValue([]),
  createDescendantsQueryBuilder: jest.fn(),
  createAncestorsQueryBuilder: jest.fn(),
};

describe('mockRepository', () => {
  it('should be defined', () => {
    // No hace nada, solo es una prueba vacía
  });
});