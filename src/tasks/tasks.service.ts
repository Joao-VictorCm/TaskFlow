import { Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: 1,
      name: 'Concluir o curso de Nest',
      description: 'Finalizar o curso entendendo todos os conceitos abordados',
      completed: false,
    },
  ];

  findAll() {
    return this.tasks;
  }

  findOne(id: string) {
    return this.tasks.find((task) => task.id === Number(id)); //verificando se tem o id mandado pelo usuario na lista de tarefas
  }

  create(body: any) {
    const newId = this.tasks.length + 1; //criando um id novo

    const newTask = {
      id: newId,
      ...body,
    };

    this.tasks.push(newTask); //.push para add a lista de tarefas

    return newTask;
  }
}
