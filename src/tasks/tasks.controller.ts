import { Controller, Get } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Get()
  getTasks() {
    return 'listando as tarefas...';
  }

  @Get('/teste')
  getTest() {
    return 'Teste tarefas...';
  }
}
