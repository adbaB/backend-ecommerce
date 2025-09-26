import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from "../categories/entities/categories.entity";

@Module({imports:[TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('database.host'),
    port: +configService.get('database.port'),
    username: configService.get('database.user'),
    password: configService.get('database.password'),
    database: configService.get('database.database'),
    entities: [Category],
    synchronize: configService.get('node.env') === 'test' ? true: false,
    autoLoadEntities:true,
  }),
  inject: [ConfigService],
})]})
export class DatabaseModule {}