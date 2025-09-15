import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CategoriesService } from "../services/categories.service";
import { CreateCategorieDTO } from "./dto/create.dto";

@Controller()
export class CategoriesController {

  constructor(private readonly categoriesService:CategoriesService){}


  @MessagePattern('categories.create')
  handlerCreatedCategories(@Payload() categorie: CreateCategorieDTO) {
    console.log('[categorie-created]: Received new categorie',categorie)
  }

  @MessagePattern('categories.get')
  getCategories(){
    return this.categoriesService.find()
  }

}