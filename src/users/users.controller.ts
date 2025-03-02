import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPatloadParm } from 'src/auth/param/token-payload.param';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get(':id')
  findOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @TokenPatloadParm() tokenPayLoad: PayloadTokenDto,
  ) {
    return this.userService.update(id, updateUserDto, tokenPayLoad);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @TokenPatloadParm() tokenPayLoad: PayloadTokenDto,
  ) {
    return this.userService.delete(id, tokenPayLoad);
  }

  @UseGuards(AuthTokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  //@UseInterceptors(FilesInterceptor('file'))
  @Post('upload')
  async uploadAvatar(
    @TokenPatloadParm() tokenPayLoad: PayloadTokenDto,
    @UploadedFile() file: Express.Multer.File,
    //@UploadedFile() files: Express.Multer.File,
  ) {
    const mimeType = file.mimetype;
    const fileExtension = path
      .extname(file.originalname)
      .toLocaleLowerCase()
      .substring(1); //pegando só o final do arquivo ex: .jpg ou .png

    console.log(mimeType, fileExtension);

    const fileName = `${tokenPayLoad.sub}.${fileExtension}`; //pega a foto e troca o nome por um id do usuario

    const fileLocale = path.resolve(process.cwd(), 'files', fileName); //salvando a img na pasta files

    await fs.writeFile(fileLocale, file.buffer); //.buffer é o nome do arquivo da img

    //Exemplo de codigo para varios uploads de um vez
    // files.forEach(async (file) => {
    //   const fileExtension = path
    //     .extname(file.originalname)
    //     .toLocaleLowerCase()
    //     .substring(1);
    //   const fileName = `${tokenPayLoad.sub}.${fileExtension}`;
    //   const fileLocale = path.resolve(process.cwd(), 'files', fileName);

    //   await fs.writeFile(fileLocale, file.buffer);
    // });

    return true;
  }
}
