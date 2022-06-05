import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

// Scrypt usa callbacks em vez de promises para lidar com async, promisify corrige esse comportamento para utilizar promises
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(email: string, password: string) {
    const users = await this.usersService.find(email);
    // Verifica se email está em uso
    if (users.length) {
      throw new BadRequestException('email in use');
    }
    // Hash
    // Gerando o salt
    const salt = randomBytes(8).toString('hex');

    // Fazendo has do salt e senha
    // Typescript nao entende o retorno de scrypt, portando é informado com as Buffer
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Juntando o hash com o salt
    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create(email, result);

    return user;
  }

  async login(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if(!user) {
      throw new NotFoundException('user not found')
    }

    // Separa o hash do salt
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if(storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Password is incorrect')
    }

    return user
  }
}
