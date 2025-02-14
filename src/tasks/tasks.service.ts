import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private tasks: Task[] = [
    {
      id: 1,
      name: 'Concluir o curso de Nest',
      description: 'Finalizar o curso entendendo todos os conceitos abordados',
      completed: false,
    },
  ];

  async findAll() {
    const allTask = await this.prisma.task.findMany(); //findMany faz pegar todos os dados do sql do id ao date
    return allTask;
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: id, //findFirst faz ele retornar o primeiro id q é igual ao id  caso achar retorna a const task
      },
    });

    if (task?.name) return task; //se o task existir vai retorna-la se não vai cair no erro

    throw new HttpException('Essa tarefa não existe', HttpStatus.NOT_FOUND); //tratando o erro caso a task não existe
  }

  create(createTaskDto: CreateTaskDto) {
    const newId = this.tasks.length + 1; //criando um id novo

    const newTask = {
      id: newId,
      ...createTaskDto, //neste caso a task criada vai iniciar com id automatico o retorno do usuario e o completed como false já
      completed: false,
    };

    this.tasks.push(newTask); //.push para add a lista de tarefas

    return newTask;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    const taskIndex = this.tasks.findIndex((tasks) => tasks.id === id); //findeIndex é para pegar o index da task e achando a poosição dele na lista

    if (taskIndex < 0) {
      //verificando se a task existe
      throw new HttpException('Essa tarefa não existe', HttpStatus.NOT_FOUND); // Resposta se tiver erro
    }

    const taskItem = this.tasks[taskIndex];

    this.tasks[taskIndex] = {
      ...taskItem, //mantem tudo oq já tem
      ...updateTaskDto, //vai atualizar com oq retornar do body
    };

    return this.tasks[taskIndex];
  }

  delete(id: number) {
    const taskIndex = this.tasks.findIndex((tasks) => tasks.id === id);

    if (taskIndex < 0) {
      throw new HttpException('Essa tarefa não existe', HttpStatus.NOT_FOUND);
    }

    this.tasks.splice(taskIndex, 1); //remove o primeiro item retornado do taskIndex

    return {
      message: 'Tarefa excluida com sucesso!',
    };
  }
}
