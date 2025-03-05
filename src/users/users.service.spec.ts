/*Testes Unitarios
> AAA
> Configuração do test (Arrange)
> Algo que deseja fazer a ação (Act)
> Conferir se ação foi esperada (Assert)

Exemplo de teste unitario 

describe('UsersService', () => {
  it('desveria testar o modulo users', () => {
    const numero1 = 150;
    const numero2 = 100;

    const conta = numero1 - numero2;

    expect(conta).toBe(50);
    //espera que a conta seja igual a 50
  });
});
*/

import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from './users.service';
import { HashingServiceProtocol } from 'src/auth/hash/hash.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('UsersService', () => {
  let userService: UsersService;
  let prismaService: PrismaService;
  let hashingService: HashingServiceProtocol;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      //Isso é um mok ou seja tudo que tem na parte constructor  no userService
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: HashingServiceProtocol,
          useValue: {},
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    hashingService = module.get<HashingServiceProtocol>(HashingServiceProtocol);
  });
  it('should be define users service', () => {
    console.log(userService);
    expect(userService).toBeDefined();
  });
});
