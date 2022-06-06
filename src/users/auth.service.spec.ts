import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  // Roda antes de todos os it
  beforeEach(async () => {
    // Criando uma cópia falsa de UsersService
    const users: User[] = [];
    fakeUsersService = {
      // Métodos falsos de user service usados em auth service
      // Promise.resolve simula async
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    // Simulando o DI Container (Container de injeção de dependencias)
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        // Se pedir UsersService, usar fakeUsersService
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.register('test@email.com', '1234');

    expect(user.password).not.toEqual('1234');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('thows an error if user registers with email that is in use', async () => {
    await service.register('test@email.com', '1234');

    try {
      await service.register('test@email.com', '1234');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message).toBe('email in use');
    }
  });

  it('throws if login is called with an unused email', async () => {
    try {
      await service.login('wrong@email.com', 'pass');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('user not found');
    }
  });

  it('it throws if an invalid password is provided', async () => {
    await service.register('test@email.com', '1234')

    try {
      await service.login('test@email.com', 'wrongpass');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message).toBe('Password is incorrect');
    }
  });

  it('returns a user if correct email and password are provided', async () => {
    await service.register('test@email.com', '1234')

    const user = await service.login('test@email.com', '1234');
    expect(user).toBeDefined();
  });
});
