import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}
  @Get()
  findAllTasks() {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOneTask(@Param('id') id: string) {
    //Pegando o id da task
    return this.taskService.findOne(id);
  }

  @Post('/create')
  createTask(@Body() body: any) {
    console.log(body);

    return this.taskService.create(body);
  }

  @Patch(':id')
  updateTask(@Param('id') id: string, @Body() body: any) {
    return this.taskService.update(id, body);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    console.log('ID enviado: ', id);

    return 'Deletar a tarefa com ID ' + id;
  }
}
