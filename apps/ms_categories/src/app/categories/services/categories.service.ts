import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Category } from "../entities/categories.entity"


@Injectable()
export class CategoriesService {

  constructor(@InjectRepository(Category) private readonly categoryRepo: Repository<Category>){}


  create(dto:any):string
  create(dto:any[]):string
  {
    return 'created'
  }

  find(){
    return [{hi:'hi'}]
  }
  findById(id:string){
    return 'product1'
  }

  update(id:string,dto:Partial<any>){
    return 'categorie updated'
  }

  
}