import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    const task = this.tasks.find((task) => task.id === Number(id)); //verificando se tem o id mandado pelo usuario na lista de tarefas

    if (task) return task; //se não existir ira retornar false

    throw new HttpException('Essa tarefa não existe', HttpStatus.NOT_FOUND); //tratando o erro caso a task não existe
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

  update(id: string, body: any) {
    const taskIndex = this.tasks.findIndex((tasks) => tasks.id === Number(id)); //findeIndex é para pegar o index da task e achando a poosição dele na lista

    if (taskIndex < 0) {
      //verificando se a task existe
      throw new HttpException('Essa tarefa não existe', HttpStatus.NOT_FOUND); // Resposta se tiver erro
    }

    const taskItem = this.tasks[taskIndex];

    this.tasks[taskIndex] = {
      ...taskItem, //mantem tudo oq já tem
      ...body, //vai atualizar com oq retornar do body
    };

    return this.tasks[taskIndex];
  }

  delete(id: string) {
    const taskIndex = this.tasks.findIndex((tasks) => tasks.id === Number(id));

    if (taskIndex < 0) {
      throw new HttpException('Essa tarefa não existe', HttpStatus.NOT_FOUND);
    }

    this.tasks.splice(taskIndex, 1); //remove o primeiro item retornado do taskIndex

    return {
      message: 'Tarefa excluida com sucesso!',
    };
  }
}
