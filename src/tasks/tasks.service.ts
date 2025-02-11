import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  listAllTasks() {
    return [{ id: 1, task: 'Comprar pão' }];
  }

  teste02() {
    return [{ id: 1, teste01: 'esta tudo ok...' }];
  }
}
