import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Category } from "./entities/categories.entity";
import { CategoriesService } from "./services/categories.service";

@Module({
  imports:[TypeOrmModule.forFeature([Category])],
  providers:[CategoriesService],
  exports:[CategoriesService]
})
export class CategoryModule {}