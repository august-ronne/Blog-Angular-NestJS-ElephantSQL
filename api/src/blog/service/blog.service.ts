import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { map } from 'rxjs';
import { User } from 'src/user/models/user.interface';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { BlogEntryEntity } from '../ model/blog-entry.entity';
import { BlogEntry } from '../ model/blog-entry.interface';

import * as path from 'path';
const slugify = require('slugify');

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntryEntity)
    private readonly blogRepository: Repository<BlogEntryEntity>,
    private userService: UserService,
  ) {}

  async createBlogEntry(user: User, blogEntry: BlogEntry): Promise<BlogEntry> {
    blogEntry.author = user;
    blogEntry.slug = await this.generateSlug(blogEntry.title);
    return this.blogRepository.save(blogEntry);
  }

  async updateOne(id: number, blogEntry: BlogEntry): Promise<BlogEntry> {
    await this.blogRepository.update(id, blogEntry);
    return this.findOne(id);
  }

  async deleteOne(id: number): Promise<any> {
    return this.blogRepository.delete(id);
  }

  async findOne(id: number): Promise<BlogEntry> {
    return this.blogRepository.findOne({ id }, { relations: ['author'] });
  }

  async findAll(): Promise<BlogEntry[]> {
    return this.blogRepository.find({ relations: ['author'] });
  }

  async paginateAll(
    options: IPaginationOptions,
  ): Promise<Pagination<BlogEntry>> {
    return paginate<BlogEntry>(this.blogRepository, options, {
      relations: ['author'],
    });
  }

  async paginateByUser(
    options: IPaginationOptions,
    userId: number,
  ): Promise<Pagination<BlogEntry>> {
    return paginate<BlogEntry>(this.blogRepository, options, {
      relations: ['author'],
      where: [{ author: userId }],
    });
  }

  async findByUser(userId: number): Promise<BlogEntry[]> {
    return this.blogRepository.find({
      where: { author: userId },
      relations: ['author'],
    });
  }

  async getHeaderImage(
    imageFileName: string,
    @Res() responseSender,
  ): Promise<Object> {
    return responseSender.sendFile(
      path.join(
        process.cwd(),
        'uploads/blog-entry-header-images/' + imageFileName,
      ),
    );
  }

  async generateSlug(title: string): Promise<string> {
    return slugify(title);
  }
}
