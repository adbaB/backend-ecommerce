import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CategoriesService } from "../services/categories.service";

@Controller()
export class CategoriesController {

  constructor(private readonly categoriesService:CategoriesService){}


  @MessagePattern('categories-created')
  handlerCreatedCategories(@Payload() categorie: any) {
    console.log('[categorie-created]: Received new categorie',categorie)
  }

}