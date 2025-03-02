/*
DTO > Data Transfer Object (Objeto de transferencia de dados)
> Validar dados, transformar dados.
> Se usa para representar quis dados e em que formatos uma determinada camada 
aceita trabalhar

> readonly deixa o item apenas para leitura
*/

import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString({ message: 'O nome precisar ser um texto' })
  @MinLength(5, { message: 'O nome precisa ter 5 caracteres' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  readonly name: string;

  @IsString({ message: 'O nome precisar ser um texto' })
  @IsNotEmpty({ message: 'A descrição não pode estar vazia' })
  @MinLength(5, { message: 'A descrição precisa ter 5 caracteres' })
  @MaxLength(70, { message: 'Maximo de 35 caracteres permitidos' })
  readonly description: string;
}
