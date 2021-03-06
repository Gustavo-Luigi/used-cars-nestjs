import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    // O genérico de Repository<> não é o suficiente para injetar o repositório corretamente, portanto, precisa do decorador InjectRepository()
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  create(email: string, password: string) {
    // Create cria um entidade antes de enviar para o banco em Save.
    // Hooks do TypeOrm e validações são executados na entidade, portanto, é melhor usar create e passar o retorno para save.
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  findOne(id: number) {
    // Se id for null, findOne by Id retorna o primeiro que encontrar. Este if protege contra isso
    if (!id) {
      throw new NotFoundException('user not found');
    }
    return this.repo.findOneBy({ id });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found!');
    }
    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return this.repo.remove(user);
  }
}
