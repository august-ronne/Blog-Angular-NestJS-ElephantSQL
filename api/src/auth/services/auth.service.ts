import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable } from 'rxjs';
import { User } from 'src/user/models/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJWT(payload: User): Promise<string> {
    return this.jwtService.signAsync({ user: payload });
  }

  async hashPassword(password: string): Promise<string> {
    const numberOfRounds: number = 12;
    return bcrypt.hash(password, numberOfRounds);
  }

  async comparePasswords(
    password: string,
    hash: string,
  ): Promise<any | boolean> {
    return bcrypt.compare(password, hash);
  }
}
