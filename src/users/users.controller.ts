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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPatloadParm } from 'src/auth/param/token-payload.param';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';

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
}
