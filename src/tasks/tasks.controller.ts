import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}
  @Get()
  getTasks() {
    return this.taskService.listAllTasks;
  }

  @Get('/teste')
  getTest() {
    return this.taskService.teste02;
  }
}
