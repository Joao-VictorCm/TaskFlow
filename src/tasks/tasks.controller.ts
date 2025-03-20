import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { LoggerInterceptor } from 'src/common/interceptors/logger.interceptor';
import { BodyCreateTaskInterceptor } from 'src/common/interceptors/body-create-task.interceptor';
import { AddHeaderIntercptor } from 'src/common/interceptors/add-hader.interceptor';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { TokenPatloadParm } from 'src/auth/param/token-payload.param';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
import { ResponseTaskDto } from './dto/response-task.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}
  @Get()
  @ApiOperation({ summary: 'Listar todas as tasks' })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Limite de tarefas a serem buscadas',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    example: 0,
    description: 'Quantidade de itens que deseja pular',
  })
  findAllTasks(@Query() paginationDto: PaginationDto) {
    return this.taskService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar detalhes de apenas uma task' })
  @ApiParam({
    name: 'id',
    description: 'ID da tarefa',
    example: 1,
  })
  findOneTask(@Param('id', ParseIntPipe) id: number) {
    //Pegando o id da task
    return this.taskService.findOne(id);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar uma nova task' })
  @ApiParam({
    name: 'id',
    description: 'ID da tarefa',
    example: 1,
  })
  @Post('/create')
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @TokenPatloadParm() tokenPayload: PayloadTokenDto,
  ) {
    return this.taskService.create(createTaskDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar uma task específica' })
  @Patch(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @TokenPatloadParm() tokenPayload: PayloadTokenDto,
  ) {
    return this.taskService.update(id, updateTaskDto, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar uma task' })
  @Delete(':id')
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @TokenPatloadParm() tokenPayload: PayloadTokenDto,
  ) {
    console.log('ID enviado: ', id);

    return this.taskService.delete(id, tokenPayload);
  }
}

//ParseIntPipe converte a id de string para number !!
