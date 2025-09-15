import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { CategoriesController } from './categories/categories.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'ms_gateway',
            brokers: ['localhost:9092'],
          },
          producer:{
            createPartitioner: Partitioners.DefaultPartitioner,
          }
        },
      },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [],
})
export class AppModule {}
