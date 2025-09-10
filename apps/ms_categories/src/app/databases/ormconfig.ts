import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
const configService = new ConfigService();

const source = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  synchronize: false,
  logging: false,
  migrations: [__dirname + '/migrations/*.ts'],
  migrationsTableName: 'migrations',
  entities: [__dirname + '/../**/**/*.entity.ts'],
});

export default source;
