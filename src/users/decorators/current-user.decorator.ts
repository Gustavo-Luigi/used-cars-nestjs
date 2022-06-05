import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// A diferença entre Request e ExecutionContext é que Request considera apenas requisições HTTP, ExecutionContext considera outras possibilidades, como por exemplo, websockets e graphQl

export const CurrentUser = createParamDecorator(
  // data nunca será usar neste decorador em especifico, portanto, tipo never
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.CurrentUser;
  },
);
