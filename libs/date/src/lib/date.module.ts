import { Module, Global } from '@nestjs/common';
import { BackendDateService } from './date.service';

@Global()
@Module({
  controllers: [],
  providers: [BackendDateService],
  exports: [BackendDateService],
})
export class BackendDateModule {}
