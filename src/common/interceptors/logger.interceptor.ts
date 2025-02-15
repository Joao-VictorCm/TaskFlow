import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LoggerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    console.log(`[REQUEST] ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        console.log(`[RESPONSE] ${method} ${url} - ${Date.now() - now}ms `);
      }),
    );
  }
}
