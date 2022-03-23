import { BadRequestException, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/services/auth.service';
import { getRepository, Like, Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { UserRole } from '../models/user-roles.enum';
import * as path from 'path';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  async create(userData: User): Promise<User> {
    const passwordHash = await this.authService.hashPassword(userData.password);
    const user = this.userRepository.create({
      name: userData.name,
      username: userData.username,
      email: userData.email,
      password: passwordHash,
      roles: [UserRole.USER],
    });
    const createdUser: User = await this.userRepository.save(user);
    delete createdUser.password;
    return createdUser;
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ id });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
    return paginate<User>(this.userRepository, options);
  }

  async paginateFilterByUsername(
    options: IPaginationOptions,
    user: User,
  ): Promise<Pagination<User>> {
    const [users, totalUsers] = await this.userRepository.findAndCount({
      skip: Number(options.page) * Number(options.limit) || 0,
      take: Number(options.limit) || 10,
      order: { id: 'ASC' },
      select: ['id', 'name', 'username', 'email', 'roles'],
      where: [{ username: Like(`%${user.username}%`) }],
    });
    const nextPage = Number(options.page) + 1;
    const lastPage = Math.ceil(Number(totalUsers) / Number(options.page));
    const usersPageable: Pagination<User> = {
      items: users,
      links: {
        first: options.route + `?limit=${options.limit}`,
        previous: options.route + ``,
        next: options.route + `?limit=${options.limit}&page=${nextPage}`,
        last: options.route + `?limit=${options.limit}&page=${lastPage}`,
      },
      meta: {
        currentPage: Number(options.page),
        itemCount: users.length,
        itemsPerPage: Number(options.limit),
        totalItems: totalUsers,
        totalPages: Math.ceil(Number(totalUsers) / Number(options.limit)),
      },
    };
    return usersPageable;
  }

  async deleteOne(id: number): Promise<any> {
    return this.userRepository.delete(id);
  }

  async updateOne(id: number, user: User): Promise<any> {
    delete user.email;
    delete user.password;
    delete user.roles;
    await this.userRepository.update(id, user);
    return this.userRepository.findOne(id);
  }

  async updateRoleOfUser(id: number, user: User): Promise<any> {
    return this.userRepository.update(id, user);
  }

  async login(user: User): Promise<Object> {
    const validatedUser = await this.validateUser(user.email, user.password);
    delete validatedUser.password;
    const jwt: string = await this.authService.generateJWT(validatedUser);
    return { access_token: jwt };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findByEmailLogin(email);
    if (user) {
      const match = await this.authService.comparePasswords(
        password,
        user.password,
      );
      if (match) {
        return user;
      } else {
        throw new BadRequestException('Passwords did not match');
      }
    } else {
      throw new BadRequestException(
        'No User registered with that email address',
      );
    }
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email });
  }

  async findByEmailLogin(userEmail: string): Promise<User> {
    const user = await getRepository(UserEntity).findOne({
      select: ['id', 'name', 'username', 'email', 'password', 'roles'],
      where: { email: userEmail },
    });
    return user;
  }

  async getProfileImage(
    imageFileName: string,
    @Res() responseSender,
  ): Promise<Object> {
    return responseSender.sendFile(
      path.join(process.cwd(), 'uploads/profileimages/' + imageFileName),
    );
  }
}
