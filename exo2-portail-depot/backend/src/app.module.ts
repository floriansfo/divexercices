import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RequestsModule } from './requests/requests.module';
import { PublicModule } from './public/public.module';

@Module({
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot({isGlobal: true,}), RequestsModule, PublicModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
