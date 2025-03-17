import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app/app.module';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from 'src/tasks/tasks.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import * as dotenv from 'dotenv';
import { PrismaService } from 'src/prisma/prisma.service';
import { execSync } from 'node:child_process';
import { isTypedSql } from '@prisma/client/runtime/library';

dotenv.config({ path: '.env.test' });

describe('Users (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;

  beforeAll(() => {
    execSync('npx prisma migrate deploy');
  });

  beforeEach(async () => {
    execSync(
      'cross-env DATABASE_URL=file:./dev-test.db npx prisma migrate deploy',
    );

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        TasksModule,
        UsersModule,
        AuthModule,
        ServeStaticModule.forRoot({
          rootPath: join(__dirname, '..', '..', 'files'), //caminho para a pasta files
          serveRoot: '/files',
        }),
      ],
    }).compile();

    app = module.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    prismaService = module.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterEach(async () => {
    await prismaService.user.deleteMany();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/users', () => {
    it('/users (POST) - createUser', async () => {
      const createUserDto = {
        name: 'Fulano',
        email: 'fulano@gmail.como',
        password: '123123',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toEqual({
        id: response.body.id,
        name: 'Fulano',
        email: 'fulano@gmail.como',
      });
    });

    it('/users (POST) - weak password', async () => {
      const createUserDto = {
        name: 'Fulano',
        email: 'fulano@gmail.como',
        password: '123',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(400);
    });

    it('/users (PATCH) - update user', async () => {
      const createUserDto = {
        name: 'Fulano',
        email: 'fulano@gmail.com',
        password: '123123',
      };

      const updateUserDto = {
        name: 'Ciclano',
      };

      const user = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      const userId = user.body.id;

      const auth = await request(app.getHttpServer()).post('/auth').send({
        email: createUserDto.email,
        password: createUserDto.password,
      });

      expect(auth.body.token).toEqual(auth.body.token);

      const result = await request(app.getHttpServer())
        .patch(`/users/${auth.body.id}`)
        .set('Authorization', `Bearer ${auth.body.token}`)
        .send(updateUserDto);

      expect(result.body).toEqual({
        id: userId,
        name: updateUserDto.name, // Agora espera "Ciclano"
        email: createUserDto.email,
      });
    });
  });
});
