import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { AppService } from './app.service';

@Controller('categories')
export class AppController implements OnModuleInit {
  constructor(
    private readonly appService: AppService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka
  ) {}
  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('get-categories');
    this.kafkaClient.connect()
  }

  @Get()
  async getData() {
    return firstValueFrom(
      this.kafkaClient.send('get-categories', { id: 1 }).pipe(
        catchError((error: any) => {
          throw new UnprocessableEntityException(error);
        })
      )
    );
  }

  @Post('')
  createCategories(@Body() order: any) {
    this.kafkaClient.emit('categories-created', order);
    return { message: 'categories set', order };
  }
}
