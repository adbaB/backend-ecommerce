import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { AppModule } from './app/app.module';

async function bootstrap() {
  console.log('🚀 Starting microservice...');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const kafkaBroker = configService.get('kafka.broker');
  const kafkaClientId = configService.get('kafka.clientId');
  const kafkaGroupId = configService.get('kafka.groupId');


  console.log(kafkaBroker, kafkaClientId, kafkaGroupId);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: { brokers: [kafkaBroker], clientId: kafkaClientId },
      consumer: { groupId: kafkaGroupId },
      producer:{
        createPartitioner: Partitioners.DefaultPartitioner,
        allowAutoTopicCreation: true
      }

    },
  })

  await app.startAllMicroservices();
  Logger.log(`🚀 Application is listening to kafka`);
}

bootstrap();
