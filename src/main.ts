import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// Não é possivel importar cookieSession com import from devido algumas configurações do TS exigidas pelo NestJs
// import {cookieSession} from 'cookie-session'
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieSession({
    keys: ['asfsadfas']
  }))
  app.useGlobalPipes(
    new ValidationPipe({
      // Whitelist true bloqueia propriedades indesejadas
      whitelist: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
