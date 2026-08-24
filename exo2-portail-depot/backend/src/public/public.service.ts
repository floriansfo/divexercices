import { Injectable, UnauthorizedException, NotFoundException, BadRequestException} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { checkStatus } from '../domain/deposit-request';
import { validpinformat, locked } from '../domain/pin';

@Injectable()
export class PublicService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}
    async unlock(token: string, pin: string) {
    if (!validpinformat(pin)) {
      throw new BadRequestException('Format de PIN invalide');
    }

    const depot = await this.prisma.depot.findUnique({ where: { token } });
    if (!depot) {
      throw new NotFoundException();
    }
    const now = new Date();

    if (locked(depot.lock, now)) {
      throw new UnauthorizedException('Trop de tentatives, lien temporairement bloque');
    }

    if (checkStatus(depot.expirelink, depot.completedfile, now) !== 'PENDING') {
      throw new UnauthorizedException('Lien expire ou demande deja complete');
    }

    const valide = await argon2.verify(depot.pinhash, pin);

    if (!valide) {
      const echecs = depot.failpin + 1;
      await this.prisma.depot.update({
        where: { id: depot.id },
        data: echecs >= 5
          ? { failpin: 0, lock: new Date(now.getTime() + 15 * 60 * 1000) }
          : { failpin: echecs },
      });
      throw new UnauthorizedException('PIN incorrect');
    }

    await this.prisma.depot.update({
      where: { id: depot.id },
      data: { failpin: 0, lock: null },
    });

    const sessionToken = await this.jwt.signAsync(
      { depotId: depot.id, scope: 'deposit' },
      { expiresIn: '30m' },
    );

    return { access_token: sessionToken };
}
}
