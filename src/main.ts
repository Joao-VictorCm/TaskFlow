import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/*
-src/app.module.ts: Módulo principal do app
-src/app.controller.ts: Define as rotas e lidas com as requisições 
-src/app.service.ts: contém a lógica de negócios, separado do controlador
*/

//arquivo que inicia o projeto
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', //aceitando de qual origem vamos aceitar as solicitações http
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Se True ele remove as chaves que não estão no DTO
    }),
  );

  const configSwagger = new DocumentBuilder()
    .setTitle('Lista de tasks')
    .setDescription('API lista de tasks')
    .setVersion('1.0')
    .build();

  const doucmentFactory = () =>
    SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('docs', app, doucmentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
