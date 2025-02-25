import { Global, Module } from '@nestjs/common';
import { HashingServiceProtocol } from './hash/hash.service';
import { BcryptService } from './hash/bcrypt.service';

@Global() //Módulo global - pode ser usado na aplicação inteira( não precisa importar em outros módulos para usar)
@Module({
  providers: [
    {
      provide: HashingServiceProtocol,
      useClass: BcryptService,
    },
  ],
  exports: [HashingServiceProtocol],
})
export class AuthModule {}
