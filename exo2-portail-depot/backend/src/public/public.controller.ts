import { Controller, Post, Body, Param, UseInterceptors, UploadedFile, Headers, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtService } from '@nestjs/jwt';
import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService, private readonly jwt: JwtService) {}

  @Post(':token/unlock')
  async unlock(@Param('token') token: string, @Body() body: { pin: string }) {
    return this.publicService.unlock(token, body.pin);
  }
  @Post(':token/files')
  @UseInterceptors(FileInterceptor('file'))
  async addFile(
    @Headers('authorization') auth: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }
    const payload = await this.jwt.verifyAsync(auth.slice(7));
    if (payload.scope !== 'deposit') {
      throw new UnauthorizedException();
    }
    return this.publicService.addFile(
      payload.depotId,
      file.originalname,
      file.buffer,
      file.mimetype,
    );
  }
}