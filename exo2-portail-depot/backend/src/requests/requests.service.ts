import { Injectable } from '@nestjs/common';
import { randomBytes, randomInt } from 'crypto';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { checkStatus } from '../domain/deposit-request';


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
    const depots = await this.prisma.depot.findMany({
      where: { ownid: ownerId },
      orderBy: { create: 'desc' },
      include: { files: true },
    });

    const now = new Date();

    return depots.map((depot) => ({
      id: depot.id,
      title: depot.title,
      token: depot.token,
      expectedFileCount: depot.filecount,
      uploadedFileCount: depot.files.length,
      expiresAt: depot.expirelink,
      createdAt: depot.create,
      status: checkStatus(depot.expirelink, depot.completedfile, now),
      files: depot.files.map((f) => ({
        id: f.id,
        name: f.name,
        size: f.size,
        createdAt: f.create,
      })),
    }));
  }
}

