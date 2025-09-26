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
      
      const existingCategory = await this.categoryRepo.findOne({where:{ name }});

      if (existingCategory) {
        throw new RpcException({
          status: 'error',
          error: {
            code: HttpStatus.CONFLICT,
            message: 'Category already exists',
            details: `Category with name ${name} already exists`,
          },
          timestamp: new Date(),
        });
      }   

      const existingSlug = await this.categoryRepo.findOne({where:{ slug }});
      if (existingSlug) {
        throw new RpcException({
          status: 'error',
          error: {
            code: HttpStatus.CONFLICT,
            message: 'Slug already exists',
            details: `Category with slug ${slug} already exists`,
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
              code: HttpStatus.NOT_FOUND,
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
      if(error instanceof RpcException) {
        throw error;
      }
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

  remove(id: string) {
    return 'categorie removed';
  }
}
