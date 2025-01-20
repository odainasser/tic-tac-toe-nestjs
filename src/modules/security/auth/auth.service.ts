import { Injectable, Inject } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from '../../../shared/dtos/auth/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.findOneByEmail(email);
      if (user && (await bcrypt.compare(password, user.password))) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      throw new Error(`Failed to validate user: ${error.message}`);
    }
  }

  async login(loginDto: LoginDto): Promise<any> {
    try {
      const { email, password } = loginDto;
      const user = await this.validateUser(email, password);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const payload = { username: user.email, sub: user.id, type: 'user' };
      const token = this.jwtService.sign(payload);
      await this.cacheManager.set(user.id, token, { ttl: 3600 });

      return {
        access_token: token,
      };
    } catch (error) {
      throw new Error(`Failed to login: ${error.message}`);
    }
  }
}
