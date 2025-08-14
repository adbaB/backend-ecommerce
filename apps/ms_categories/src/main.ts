import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: { brokers: ['localhost:9092'] },
        consumer: { groupId: 'categories-consumer-group' },
        producer:{
          createPartitioner: Partitioners.DefaultPartitioner
        }

      },
    }
  );
  await app.listen();
  Logger.log(`🚀 Application is listening to kafka`);
}

bootstrap();
