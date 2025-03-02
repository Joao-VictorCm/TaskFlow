import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingServiceProtocol } from 'src/auth/hash/hash.service';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol,
  ) {}
  async findOne(id: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true, //isso é para retornar apenas esses itens quando o usuario for cadastrado na resposta do terminal
        email: true,
        avatar: true,
        Task: true,
      },
    });

    if (user) return user;

    throw new HttpException('Usuario não encontrado!', HttpStatus.BAD_REQUEST);
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const passwordHash = await this.hashingService.hash(
        createUserDto.password,
      ); //Pegando a senha e gerando o hash já

      const user = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          passwordHash: passwordHash,
        },
        select: {
          id: true,
          name: true, //isso é para retornar apenas esses itens quando o usuario for cadastrado na resposta do terminal
          email: true,
        },
      });

      return user;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Usuario não encontrado!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    tokenPayLoad: PayloadTokenDto,
  ) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
      });

      if (!user) {
        throw new HttpException('Usuario não existe!', HttpStatus.BAD_REQUEST);
      }

      if (user.id !== tokenPayLoad.sub) {
        throw new HttpException('Acesso negado', HttpStatus.BAD_REQUEST);
      }

      const dataUser: { name?: string; passwordHash?: string } = {
        name: updateUserDto.name ? updateUserDto.name : user.name,
      };

      if (updateUserDto?.password) {
        //Se tiver o password vai gerar a nova senha
        const passwordHash = await this.hashingService.hash(
          updateUserDto?.password,
        );
        dataUser['passwordHash'] = passwordHash; // Gerando a nova senha
      }

      const updateUser = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: dataUser.name,
          passwordHash: dataUser?.passwordHash
            ? dataUser?.passwordHash
            : user.passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      return updateUser;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Falha ao cadastrar esse usuario!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: number, tokenPayLoad: PayloadTokenDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
      });

      if (!user) {
        throw new HttpException('Usuario não existe!', HttpStatus.BAD_REQUEST);
      }

      if (user.id !== tokenPayLoad.sub) {
        throw new HttpException('Acesso negado!', HttpStatus.BAD_REQUEST);
      }

      await this.prisma.user.delete({
        where: {
          id: user.id,
        },
      });

      return {
        message: 'Usuario foi deletado',
      };
    } catch (err) {
      throw new HttpException(
        'Falha ao deletar  usuario!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async uploadAvatarImage(
    tokenPayLoad: PayloadTokenDto,
    file: Express.Multer.File,
  ) {
    try {
      const mimeType = file.mimetype;
      const fileExtension = path
        .extname(file.originalname)
        .toLocaleLowerCase()
        .substring(1); //pegando só o final do arquivo ex: .jpg ou .png
      const fileName = `${tokenPayLoad.sub}.${fileExtension}`; //pega a foto e troca o nome por um id do usuario
      const fileLocale = path.resolve(process.cwd(), 'files', fileName); //salvando a img na pasta files
      await fs.writeFile(fileLocale, file.buffer);

      const user = await this.prisma.user.findFirst({
        where: {
          id: tokenPayLoad.sub, //achando o usuario
        },
      });

      if (!user) {
        throw new HttpException(
          'Falha ao atualizar o avatar do usuario!',
          HttpStatus.BAD_REQUEST,
        );
      }

      const updateUser = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          avatar: fileName,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      });

      return updateUser;
    } catch (err) {
      throw new HttpException(
        'Falha ao atualizar o avatar do usuario!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
