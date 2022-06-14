import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use em main.ts funciona mas causa errors ao usar testes unitarios, a nao ser que inicializados por uma função, que poderia ser chamada no código do teste.
  // app.use(cookieSession({
  //   keys: ['asfsadfas']
  // }))
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //   }),
  // );

  await app.listen(3000);
}
bootstrap();
