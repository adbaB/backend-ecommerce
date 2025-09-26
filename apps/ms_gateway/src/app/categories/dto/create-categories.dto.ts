import { IsAlphanumeric, IsHexColor, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateCategoriesDto {

  @IsNotEmpty({message:'name is required'})
  name!: string;

  @IsNotEmpty({message:'slug is required'})
  @IsAlphanumeric('es-ES', {message:'slug must be alphanumeric'})
  slug!: string;

  @IsOptional({message:'color is optional'})
  @IsHexColor({message:'color must be a valid hex color'})
  color?: string;
  

  @IsOptional({message:'parentUuid is optional'})
  @IsUUID(4,{message:'parentUuid must be a valid uuid'})
  parentUuid?:string
}