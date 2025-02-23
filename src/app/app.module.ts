import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from 'src/tasks/tasks.module';
import { UsersModule } from 'src/users/users.module';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';
import { APP_GUARD } from '@nestjs/core';
import { AuthAdminGuard } from 'src/common/guards/admin.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), TasksModule, UsersModule],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthAdminGuard, //O Guards vai passar por todas as rotas (task e user)
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*', //middleware vai passar por todas as rotas (task e user)
      method: RequestMethod.ALL, //E tambem vai passar por todas as requisções GET, PUT ...
    });
  }
}
