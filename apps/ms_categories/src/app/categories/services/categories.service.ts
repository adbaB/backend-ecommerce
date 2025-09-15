import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { KafkaResponse } from '../../common/kafka-reponse.interface';
import { CreateCategorieDTO } from '../controllers/dto/create.dto';
import { Category } from '../entities/categories.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: TreeRepository<Category>
  ) {}

  async create({
    name,
    slug,
    color,
    parentUuid,
  }: CreateCategorieDTO): Promise<KafkaResponse<Category>> {
    let parentCategory: Category | null = null;

    try {
      if(!name || !slug) {
        throw new RpcException({
          status: 'error',
          error: {
            code: HttpStatus.BAD_REQUEST,
            message: 'name and slug are required',
            details: 'name and slug are required',
          },
          timestamp: new Date(),
        });
      }
      if (parentUuid) {
        parentCategory = await this.categoryRepo.findOne({
          where: { uuid: parentUuid },
        });
        if (!parentCategory) {
          throw new RpcException({
            status: 'error',
            error: {
              code: HttpStatus.BAD_REQUEST,
              message: 'Parent category not found',
              details: `Parent category with UUID ${parentUuid} not found`,
            },
            timestamp: new Date(),
          });
        }

        if (parentCategory && parentCategory.parent) {
          throw new RpcException({
            status: 'error',
            error: {
              code: HttpStatus.BAD_REQUEST,
              message: 'only one level of categories',
              details: `Parent category with UUID ${parentUuid} has a parent category`,
            },
          });
        }
      }
      console.log('hi')
      const category = this.categoryRepo.create({
        name,
        slug,
        color,
        parent: parentCategory,
      });

      const savedCategory = await this.categoryRepo.save(category);

      return {
        status: 'success',
        data: savedCategory,
        timestamp: new Date(),
      };
    } catch (error) {
      throw new RpcException({
        status: 'error',
        error: {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred while creating the category',
          details:
            error instanceof Error
              ? error.message
              : 'An error occurred while creating the category',
        },
        timestamp: new Date(),
      });
    }
  }

  find() {
    return [{ hi: 'hi' }];
  }
  findById(id: string) {
    return 'product1';
  }

  update(id: string, dto: Partial<any>) {
    return 'categorie updated';
  }
}
