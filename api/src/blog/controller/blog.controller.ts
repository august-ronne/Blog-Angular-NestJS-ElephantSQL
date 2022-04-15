import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BlogEntry } from '../ model/blog-entry.interface';
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
    const user = req.user.user;
    return this.blogService.createBlogEntry(user, blogEntry);
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
