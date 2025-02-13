/*
DTO > Data Transfer Object (Objeto de transferencia de dados)
> Validar dados, transformar dados.
> Se usa para representar quis dados e em que formatos uma determinada camada 
aceita trabalhar

> readonly deixa o item apenas para leitura
*/

export class CreateTaskDto {
  readonly name: string;
  readonly description: string;
}
