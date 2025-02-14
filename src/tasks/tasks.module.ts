import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule], //Importando o prisma para usar o banco de dados
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
