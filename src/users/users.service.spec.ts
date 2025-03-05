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
import { create } from 'domain';
import { hash } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';

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
          useValue: {
            user: {
              create: jest.fn(), //jeste,fn() dix que é uma função
            },
          },
        },
        {
          provide: HashingServiceProtocol,
          useValue: {
            hash: jest.fn(),
          },
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

  it('should create a new user', async () => {
    //Precisa criar um createUserDto
    //Precisa do hashingService tenha o metodo hash
    //Verificar se o hashingService foi chamado com o parametro createUserDto.password
    //Verificar se o prisma user create foi chamado
    //O retorno deve ser um novo user criado

    const createUserDto: CreateUserDto = {
      //criando o UserDto para o teste
      email: 'teste@gmail.com',
      name: 'teste',
      password: '123123',
    };

    jest.spyOn(hashingService, 'hash').mockResolvedValue('HASH_MOCK_EXEMPLO'); //retorno de exemplo para não precisar gerar hash

    await userService.create(createUserDto);

    expect(hashingService.hash).toHaveBeenCalled();

    expect(prismaService.user.create).toHaveBeenCalledWith({
      //Expera que o user.create seja chamado com esses dados
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash: 'HASH_MOCK_EXEMPLO',
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  });
});
