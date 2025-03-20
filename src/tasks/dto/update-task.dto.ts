import { IsBoolean, IsOptional } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

// export class UpdateTaskDto {
//   @IsString()
//   @IsOptional()
//   readonly name?: string;

//   @IsString()
//   @IsOptional()
//   readonly description?: string;

//   @IsBoolean()
//   @IsOptional()
//   readonly completed?: boolean;
// }

// colocar o ? na frete imforma que é opcional atulizar esses itens

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  //Reaproveita os itens mas os torna opcionais
  @IsBoolean()
  @IsOptional()
  readonly completed?: boolean;
}
