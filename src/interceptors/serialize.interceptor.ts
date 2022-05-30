import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

// Classe para gerar um pouco mais de segurança no código,
// forçando que o que seja passado para o dto, pertença a um classe e não seja,
// por exemplo, uma string
interface ClassConstructor {
  new (...args: any[]): {}
}

// Decorador para não precisar digitar uma linha tão longa como:
// @UseInterceptors(new SerializeInterceptor(UserDto))
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Roda antes que a requisição seja gerenciada pelo CallHandler, ou seja, antes de entrar no controller.

    return next.handle().pipe(
      map((data: any) => {
        // Roda antes de enviar a resposta
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
