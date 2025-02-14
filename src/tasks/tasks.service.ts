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

  async create(createTaskDto: CreateTaskDto) {
    const newTask = await this.prisma.task.create({
      data: {
        name: createTaskDto.name,
        description: createTaskDto.description,
        completed: false,
      },
    });

    return newTask;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const findTask = await this.prisma.task.findFirst({
      where: {
        id: id, //Verificando se o id existe
      },
    });

    if (!findTask) {
      //Se não existir
      throw new HttpException('Essa tarefa não existe!', HttpStatus.NOT_FOUND);
    }

    const task = await this.prisma.task.update({
      where: {
        id: findTask.id,
      },
      data: updateTaskDto, //só da para passar assim pois colocamos esses dados como opcional no UpdateTaskDto
    });

    return task;
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
