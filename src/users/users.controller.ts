import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';

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
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload')
  async uploadAvatar(
    @TokenPatloadParm() tokenPayLoad: PayloadTokenDto,
    //@UploadedFile() files: Express.Multer.File,
    @UploadedFile(
      //tipos de imagens que aceitam conforme oq colocamos abaixo
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpeg|jpg|png/g, //tipos de img aceitas
        })
        .addMaxSizeValidator({
          maxSize: 3 * (1024 * 1024), //tamanho da img neste caso 3 MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    //Exemplo de codigo para varios uploads de um vez
    //Isso passar no user.service.ts
    // files.forEach(async file => {
    //   const fileExtension = path
    //     .extname(file.originalname)
    //     .toLocaleLowerCase()
    //     .substring(1);
    //   const fileName = `${tokenPayLoad.sub}.${fileExtension}`;
    //   const fileLocale = path.resolve(process.cwd(), 'files', fileName);
    //   await fs.writeFile(fileLocale, file.buffer);
    // });

    return this.userService.uploadAvatarImage(tokenPayLoad, file);
  }
}
