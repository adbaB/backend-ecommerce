import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ExceptionFilter } from '../filters/rpc.exception';
import { CreateCategoriesDto } from './dto/create-categories.dto';

@Controller('categories')
@UseFilters(new ExceptionFilter())
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
    this.kafkaClient.subscribeToResponseOf('categories.get.one');
    // Connect to the Kafka client
    this.kafkaClient.connect();
  }

  @Get()
  /**
   * Sends a request to get categories to the Kafka topic 'categories.get'.
   * Catches any errors that occur and throws an UnprocessableEntityException.
   * @returns A promise that resolves to the first value from the observable.
   */
  async getCategories() {
    return firstValueFrom(this.kafkaClient.send('categories.get', {}).pipe());
  }

  /**
   * Sends a request to get a single category by ID to the Kafka topic 'categories.get.one'.
   * Catches any errors that occur and throws an UnprocessableEntityException.
   * @param id - The ID of the category to retrieve.
   * @returns A promise that resolves to the first value from the observable.
   */
  @Get(':id')
  async getCategory(@Param('id') id: string) {
    return firstValueFrom(this.kafkaClient.send('categories.get.one', { id }));
  }

  /**
   * Creates a new category and sends a request to the Kafka topic 'categories.create'.
   * Catches any errors that occur and throws an UnprocessableEntityException.
   * @param createCategoryDto - The create category DTO.
   * @returns A promise that resolves to the first value from the observable.
   */
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoriesDto) {
    return firstValueFrom(
      this.kafkaClient.send('categories.create', createCategoryDto).pipe()
    );
  }

  /**
   * Updates an existing category by ID and sends a request to the Kafka topic 'categories.update'.
   * Catches any errors that occur and throws an UnprocessableEntityException.
   * @param id - The ID of the category to update.
   * @param updateData - The partial data to update the category with.
   * @returns A promise that resolves to the first value from the observable.
   */
  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateCategory(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateCategoriesDto>
  ): Promise<{ status: string; message: string; timestamp: Date }> {
    this.kafkaClient.emit('categories.update', { id, updateData }).pipe();

    return {
      status: 'send',
      message: 'update request sent',
      timestamp: new Date(),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteCategory(
    @Param('id') id: string
  ): Promise<{ status: string; message: string; timestamp: Date }> {
    this.kafkaClient.emit('categories.remove', { id });

    return {
      status: 'send',
      message: 'delete request sent',
      timestamp: new Date(),
    };
  }
}
