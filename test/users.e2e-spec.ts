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

dotenv.config({ path: '.env.test' });

describe('Users (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;

  beforeAll(() => {
    execSync('npx prisma migrate deploy');
  });

  beforeEach(async () => {
    execSync(
      'cross-env DATABASE_URL=file:./dev-test.db jest npx prisma migrate deploy',
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

  it('/ (GET)', () => {});
});
