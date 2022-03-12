import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from '../models/user-roles.enum';
import { User } from '../models/user.interface';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('login')
  async login(@Body() user: User): Promise<Object> {
    return await this.userService.login(user);
  }

  @Post()
  async create(@Body() user: User): Promise<User> {
    return await this.userService.create(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findOne(Number(id));
  }

  /**
   * Returns all Users registered in the database
   * @returns array of User objects
   */
  @Get('find-all-old')
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get()
  index(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ): Promise<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.paginate({
      page: Number(page),
      limit: Number(limit),
      route: 'http://localhost:3000/api/users',
    });
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<any> {
    return await this.userService.deleteOne(Number(id));
  }

  /**
   * Update one User
   * @param id - User's id
   * @param user - new user data
   * @returns
   */
  @Put(':id')
  async updateOne(@Param('id') id: string, @Body() user: User): Promise<any> {
    return await this.userService.updateOne(Number(id), user);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role')
  async updateRoleOfUser(
    @Param('id') id: string,
    @Body() user: User,
  ): Promise<User> {
    return this.userService.updateRoleOfUser(Number(id), user);
  }
}
