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
import { Task } from 'src/tasks/entities/task.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';

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
              create: jest.fn().mockResolvedValue({
                id: 1,
                email: 'teste@gmail.com',
                name: 'teste',
              }),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: HashingServiceProtocol,
          useValue: {
            hash: jest.fn(), //jeste,fn() dix que é uma função
          },
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    hashingService = module.get<HashingServiceProtocol>(HashingServiceProtocol);
  });
  it('should be define users service', () => {
    expect(userService).toBeDefined();
  });

  describe('Create User', () => {
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

      const result = await userService.create(createUserDto);

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

      expect(result).toEqual({
        //Espera que o resultado seja igual á
        id: 1,
        name: createUserDto.name,
        email: createUserDto.email,
      });
    });

    it('should thrown erro if prisma create fails', async () => {
      const createUserDto: CreateUserDto = {
        //criando o UserDto para o teste
        email: 'teste@gmail.com',
        name: 'teste',
        password: '123123',
      };

      jest.spyOn(hashingService, 'hash').mockResolvedValue('HASH_MOCK_EXEMPLO');
      jest
        .spyOn(prismaService.user, 'create')
        .mockRejectedValue(new Error('Database error'));

      await expect(userService.create(createUserDto)).rejects.toThrow(
        new HttpException('Falha ao castra o usuario!', HttpStatus.BAD_REQUEST),
      );

      expect(hashingService.hash).toHaveBeenCalledWith(createUserDto.password);

      expect(prismaService.user.create).toHaveBeenCalledWith({
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

  describe('FindOne User', () => {
    it('Should  return a user findOne', async () => {
      //Arrange
      const mockUser = {
        id: 1,
        name: 'teste',
        email: 'tete@gmail.com',
        avatar: null,
        Task: [],
        passwordHash: 'hash_exemplo',
        active: true,
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);

      const result = await userService.findOne(1);

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          Task: true,
        },
      });

      expect(result).toEqual(mockUser);
    });

    it('should thorw error expection when user is not found', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null); //tratando de erros quando o usuario não existe

      await expect(userService.findOne(1)).rejects.toThrow(
        new HttpException('Usuario não encontrado!', HttpStatus.BAD_REQUEST),
      );

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          Task: true,
        },
      });
    });
  });

  describe('Update User', () => {
    it('Should throw exception when user is not found', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Novo  nome' };
      const tokenPayLoad: PayloadTokenDto = {
        sub: 1,
        aud: 0,
        email: 'teste@gmail.com',
        exp: 123,
        iat: 123,
        iss: 0,
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      await expect(
        userService.update(1, updateUserDto, tokenPayLoad),
      ).rejects.toThrow(
        new HttpException(
          'Falha ao cadastrar esse usuario!',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('Should throw UNAUTHORIZED exception when user is not authorized', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Novo  nome' };
      const tokenPayLoad: PayloadTokenDto = {
        sub: 5,
        aud: 0,
        email: 'teste@gmail.com',
        exp: 123,
        iat: 123,
        iss: 0,
      };

      const mockUser = {
        id: 1,
        name: 'teste',
        email: 'tete@gmail.com',
        avatar: null,
        Task: [],
        passwordHash: 'hash_exemplo',
        active: true,
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);

      await expect(
        userService.update(1, updateUserDto, tokenPayLoad),
      ).rejects.toThrow(
        new HttpException(
          'Falha ao cadastrar esse usuario!',
          HttpStatus.BAD_REQUEST, //Foi pego esse erro pq ele esta dentro de um try/catch
        ),
      );
    });

    it('should user update', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'novo nome',
        password: 'nova senha',
      };
      const tokenPayLoad: PayloadTokenDto = {
        sub: 1,
        aud: 0,
        email: 'teste@gmail.com',
        exp: 123,
        iat: 123,
        iss: 0,
      };

      const mockUser = {
        id: 1,
        name: 'teste',
        email: 'tete@gmail.com',
        avatar: null,
        passwordHash: 'hash_exemplo',
        active: true,
        createdAt: new Date(),
      };

      const updateUser = {
        id: 1,
        name: 'novo nome',
        email: 'tete@gmail.com',
        avatar: null,
        Task: [],
        passwordHash: 'novo_hash_exemplo',
        active: true,
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);
      jest.spyOn(hashingService, 'hash').mockResolvedValue('novo_hash_exemplo');
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(updateUser);

      const result = await userService.update(1, updateUserDto, tokenPayLoad);

      expect(hashingService.hash).toHaveBeenCalledWith(updateUserDto.password);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        data: {
          name: updateUserDto.name,
          passwordHash: 'novo_hash_exemplo',
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      expect(result).toEqual(updateUser);
    });
  });

  describe('Delete User', () => {
    it('Should throw error when user is not found', async () => {
      const tokenPayLoad: PayloadTokenDto = {
        sub: 1,
        aud: 0,
        email: 'teste@gmail.com',
        exp: 123,
        iat: 123,
        iss: 0,
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      await expect(userService.delete(1, tokenPayLoad)).rejects.toThrow(
        new HttpException('Falha ao deletar  usuario!', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw UNAUTHORIZED whem user is not authorized', async () => {
      const tokenPayLoad: PayloadTokenDto = {
        sub: 5,
        aud: 0,
        email: 'teste@gmail.com',
        exp: 123,
        iat: 123,
        iss: 0,
      };

      const mockUser = {
        id: 1,
        name: 'teste',
        email: 'tete@gmail.com',
        avatar: null,
        passwordHash: 'hash_exemplo',
        active: true,
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);

      await expect(userService.delete(1, tokenPayLoad)).rejects.toThrow(
        new HttpException('Falha ao deletar  usuario!', HttpStatus.BAD_REQUEST),
      );

      expect(prismaService.user.delete).not.toHaveBeenCalled();
    });
  });
});
