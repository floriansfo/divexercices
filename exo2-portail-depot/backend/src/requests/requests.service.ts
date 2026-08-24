import { Injectable } from '@nestjs/common';
import { randomBytes, randomInt } from 'crypto';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}
  async create(ownerId: string, title: string, expectedFileCount: number, validityDays: number) {
        const token = randomBytes(16).toString('hex');
        const pin = String(randomInt(0, 10000)).padStart(4, '0');
        const pinHash = await argon2.hash(pin);
        const expiresAt = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000)
  const depot = await this.prisma.depot.create({
      data: {
        title,
        token,
        pinhash: pinHash,
        filecount: expectedFileCount,
        expirelink: expiresAt,
        ownid: ownerId,
      },
    });
    return { ...depot, pin };
}
  async findAllByOwner(ownerId: string) {
    return this.prisma.depot.findMany({
      where: { ownid: ownerId },
      orderBy: { create: 'desc' },
      include: { files: true },
    });
  }
}

