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
import { CreateCategoriesDto } from './dto/create-categories.dto';

@Controller('categories')
export class CategoriesController implements OnModuleInit {
  constructor(
    
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka
  ) {}
  /**
   * Initializes the module.
   * Subscribes to response topics and connects to the Kafka client.
   */
  onModuleInit() {
    // Subscribe to response topics
    this.kafkaClient.subscribeToResponseOf('categories.get');
    this.kafkaClient.subscribeToResponseOf('categories.create');

    // Connect to the Kafka client
    this.kafkaClient.connect();
  }

  @Get()
  /**
   * Sends a request to get categories to the Kafka topic 'categories.get'.
   * Catches any errors that occur and throws an UnprocessableEntityException.
   * @returns A promise that resolves to the first value from the observable.
   */
  async getCategories(): Promise<{id: number}> {
    return firstValueFrom(
      this.kafkaClient
        .send('categories.get', { id: 1 })
        .pipe(
          catchError((error: unknown) => {
            // Catch any errors that occur and throw an UnprocessableEntityException
            if (error instanceof Error) {
              throw new UnprocessableEntityException(error.message);
            } else {
              throw error;
            }
          })
        )
    );
  }

  @Post()
  /**
   * Creates a new category and sends a request to the Kafka topic 'categories.create'.
   * Catches any errors that occur and throws an UnprocessableEntityException.
   * @param createCategoryDto - The create category DTO.
   * @returns A promise that resolves to the first value from the observable.
   */
  async createCategory(@Body() createCategoryDto: CreateCategoriesDto) {
    return firstValueFrom(
      this.kafkaClient
        .send('categories.create', createCategoryDto)
        .pipe(
          catchError((error: unknown) => {
             // Catch any errors that occur and throw an UnprocessableEntityException
             if (error instanceof Error) {
              throw new UnprocessableEntityException(error.message);
            } else {
              throw error;
            }
          })
        )
    );
  }
}
