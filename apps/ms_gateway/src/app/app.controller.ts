import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, @Inject("KAFKA_SERVICE") private readonly kafkaClient: ClientKafka) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('categories')
  createCategories(@Body() order:any){
   this.kafkaClient.emit('categories-created',order)
   return {message:'categories set', order}
  }
}
