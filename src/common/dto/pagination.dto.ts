import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Max(50)
  @Min(0)
  @IsInt() //só é permitido numero inteiro
  @Type(() => Number) //transforma os dados em number
  limit: number;

  @IsOptional()
  @Min(0)
  @IsInt()
  @Type(() => Number)
  offset: number;
}
