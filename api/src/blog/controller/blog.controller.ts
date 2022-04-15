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

@Controller('blogs')
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

  @Get(':id')
  async findOneBlogEntry(@Param('id') id: number): Promise<BlogEntry> {
    return await this.blogService.findOne(id);
  }
}
