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
}
