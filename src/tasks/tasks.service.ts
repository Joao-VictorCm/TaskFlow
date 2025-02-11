import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  findAll() {
    return [{ id: 1, task: 'Comprar pão' }];
  }

  findOne(id: string) {
    return 'Buscar tarefa com ID ' + id;
  }
}
