import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { APP_FILTER } from '@nestjs/core';
import { ApiExceptionFilter } from 'src/common/filters/exception-filter';

@Module({
  imports: [PrismaModule], //Importando o prisma para usar o banco de dados
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: APP_FILTER,
      useClass: ApiExceptionFilter, //Toda as rotas de task vai passar por esse filtro se lançamos uma exceção
    },
    {
      provide: 'Key_Token',
      useValue: 'Token_@516581',
    },
  ],
})
export class TasksModule {}
