import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/models/user.interface';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { BlogEntryEntity } from '../ model/blog-entry.entity';
import { BlogEntry } from '../ model/blog-entry.interface';
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

  async findOne(id: number): Promise<BlogEntry> {
    return this.blogRepository.findOne({ id }, { relations: ['author'] });
  }

  async findAll(): Promise<BlogEntry[]> {
    return this.blogRepository.find({ relations: ['author'] });
  }

  async findByUser(userId: number): Promise<BlogEntry[]> {
    return this.blogRepository.find({
      where: { author: userId },
      relations: ['author'],
    });
  }

  async generateSlug(title: string): Promise<string> {
    return slugify(title);
  }
}
