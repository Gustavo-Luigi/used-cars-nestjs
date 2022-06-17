import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

// Usar max workers = 1 nos scripts dos testes, isso faz com que rode 1 teste por vez, evitando problemas com o banco de testes e melhorando desempenho.
describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a register request', () => {
    const email = 'newemail@test.com';
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password: '1234',
      })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined;
        expect(email).toEqual(email);
      });
  });
});
