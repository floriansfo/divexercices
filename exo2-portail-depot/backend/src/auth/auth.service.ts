import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}
  async login(email: string, password: string) {
    const avocat = await this.prisma.avocat.findUnique({ where: { email } });
    if (!avocat) {
      throw new UnauthorizedException();
    }
    const valide = await argon2.verify(avocat.passwordHash, password);
    if (!valide) {
      throw new UnauthorizedException();
    }
    const token = await this.jwt.signAsync({
        sub: avocat.id,
        email: avocat.email,
    });
    return { access_token: token };
  }
}