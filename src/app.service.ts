import { Get, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Minha primeira aplicalção com Nest!';
  }
}
