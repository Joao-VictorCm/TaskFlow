import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

/*
-src/app.module.ts: Módulo principal do app
-src/app.controller.ts: Define as rotas e lidas com as requisições 
-src/app.service.ts: contém a lógica de negócios, separado do controlador
*/

//arquivo que inicia o projeto
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
