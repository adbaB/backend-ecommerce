import { BackendDateService } from '@libs/date';
import { Injectable } from '@nestjs/common';
@Injectable()
export class AppService {
  constructor(private readonly backendDateService: BackendDateService) {}
  getData(): { message: string } {
    return { message: this.backendDateService.sayHello() };
  }
}
