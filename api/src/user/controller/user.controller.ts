import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
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

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
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
