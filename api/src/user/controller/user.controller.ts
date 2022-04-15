import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Pagination } from 'nestjs-typeorm-paginate';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from '../models/user-roles.enum';
import { User } from '../models/user.interface';
import { UserService } from '../service/user.service';
import { UserIsUserGuard } from 'src/auth/guards/user-is-user.guard';

export const storage = {
  storage: diskStorage({
    destination: './uploads/profileimages',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
};

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
   * REPLACED WITH GET: index()
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
    @Query('username') username: string,
  ): Promise<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    if (username === null || username === undefined) {
      return this.userService.paginate({
        page: Number(page),
        limit: Number(limit),
        route: 'http://localhost:3000/api/users',
      });
    } else {
      return this.userService.paginateFilterByUsername(
        {
          page: Number(page),
          limit: Number(limit),
          route: 'http://localhost:3000/api/users',
        },
        { username },
      );
    }
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<any> {
    return await this.userService.deleteOne(Number(id));
  }

  @UseGuards(JwtAuthGuard, UserIsUserGuard)
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

  @UseGuards(JwtAuthGuard)
  @Post('upload-profile-image')
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadProfileImage(
    @Request() req,
    @UploadedFile() file,
  ): Promise<Object> {
    const user: User = req.user;
    return await this.userService.updateOne(user.id, {
      profileImage: file.filename,
    });
  }

  @Get('get-profile-image/:imagename')
  async findProfileImage(
    @Param('imagename') imagename: string,
    @Res() res,
  ): Promise<Object> {
    return await this.userService.getProfileImage(imagename, res);
  }
}
