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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BlogEntry } from '../ model/blog-entry.interface';
import { UserIsAuthorGuard } from '../guards/user-is-author.guard';
import { BlogService } from '../service/blog.service';

export const BLOG_ENTRIES_URL = 'http://localhost:3000/api/blog-entries';

@Controller('blog-entries')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBlogEntry(
    @Body() blogEntry: BlogEntry,
    @Request() req,
  ): Promise<BlogEntry> {
    const user = req.user;
    return this.blogService.createBlogEntry(user, blogEntry);
  }

  @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
  @Put(':id')
  async updateOneBlogEntry(
    @Param('id') blogEntryId: number,
    @Body() updatedBlogEntry: BlogEntry,
  ): Promise<BlogEntry> {
    return await this.blogService.updateOne(
      Number(blogEntryId),
      updatedBlogEntry,
    );
  }

  @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
  @Delete(':id')
  async deleteOneBlogEntry(@Param('id') blogEntryId): Promise<any> {
    return await this.blogService.deleteOne(blogEntryId);
  }

  /*
  Old version of Get All Blog Entries. Replaced by pageable version

  @Get()
  async findAllBlogEntries(
    @Query('userId') userId: number,
  ): Promise<BlogEntry[]> {
    if (userId) {
      return await this.blogService.findByUser(userId);
    } else {
      return await this.blogService.findAll();
    }
  }
  */

  @Get()
  async index(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return await this.blogService.paginateAll({
      limit: Number(limit),
      page: Number(page),
      route: BLOG_ENTRIES_URL,
    });
  }

  @Get('user/:user')
  async indexByUser(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Param('user') userId: number,
  ) {
    limit = limit > 100 ? 100 : limit;
    return await this.blogService.paginateByUser(
      {
        limit: Number(limit),
        page: Number(page),
        route: BLOG_ENTRIES_URL + `/user/${userId}`,
      },
      Number(userId),
    );
  }

  @Get(':id')
  async findOneBlogEntry(@Param('id') id: number): Promise<BlogEntry> {
    return await this.blogService.findOne(id);
  }
}
