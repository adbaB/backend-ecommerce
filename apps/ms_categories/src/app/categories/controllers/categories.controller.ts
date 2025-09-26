import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaResponse } from '../../common/kafka-reponse.interface';
import { Category } from '../entities/categories.entity';
import { CategoriesService } from '../services/categories.service';
import { CreateCategorieDTO } from './dto/create.dto';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @MessagePattern('categories.create')
  handlerCreatedCategories(@Payload() categorie: CreateCategorieDTO):Promise<KafkaResponse<Category>> {
    return this.categoriesService.create(categorie);
  }

  @MessagePattern('categories.get')
  getCategories() {
    return this.categoriesService.find();
  }

  @MessagePattern('categories.get.one')
  getCategory(@Payload() payload: {id:string}):Promise<Category | null> {
    return this.categoriesService.findById(payload.id)
  }

  @MessagePattern('categories.update')
  updateCategory(@Payload() payload: {id:string, updateData:Partial<CreateCategorieDTO>}):Promise<void> {
    return this.categoriesService.update(payload.id, payload.updateData)
  }

  @MessagePattern('categories.remove')
  deleteCategory(@Payload() payload: {id:string}):Promise<void> {
    return this.categoriesService.remove(payload.id)
  }
}
