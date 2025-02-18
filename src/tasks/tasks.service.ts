import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(paginationDto?: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto || {};

    const allTask = await this.prisma.task.findMany({
      //findMany faz pegar todos os dados do sql do id ao date
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    });

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
    try {
      const newTask = await this.prisma.task.create({
        data: {
          name: createTaskDto.name,
          description: createTaskDto.description,
          completed: false,
          userId: createTaskDto.userId,
        },
      });

      return newTask;
    } catch (err) {
      throw new HttpException(
        'Falha ao cadastrar tarefa!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const findTask = await this.prisma.task.findFirst({
        where: {
          id: id, //Verificando se o id existe
        },
      });

      if (!findTask) {
        //Se não existir
        throw new HttpException(
          'Essa tarefa não existe!',
          HttpStatus.NOT_FOUND,
        );
      }

      const task = await this.prisma.task.update({
        where: {
          id: findTask.id,
        },
        data: {
          name: updateTaskDto?.name ? updateTaskDto?.name : findTask.name,
          description: updateTaskDto?.description
            ? updateTaskDto?.description
            : findTask.description,
          completed: updateTaskDto?.completed
            ? updateTaskDto?.completed
            : findTask.completed,
        },
      });

      return task;
    } catch (err) {
      throw new HttpException(
        'Falha ao deletar essa tarefa',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: number) {
    try {
      const findTask = await this.prisma.task.findFirst({
        where: {
          id: id, //Verificando se o id existe
        },
      });

      if (!findTask) {
        //Se não existir o id
        throw new HttpException(
          'Essa tarefa não existe!',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prisma.task.delete({
        where: {
          id: findTask.id,
        },
      });

      return {
        message: 'Tarefa deletada com sucesso !',
      };
    } catch (err) {
      throw new HttpException(
        'Falha ao deletar essa tarefa',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
