import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './categories/category.module';
import { DatabaseModule } from './databases/database.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true}),DatabaseModule,CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
