import { Controller, Post, Body, Param } from '@nestjs/common';
import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Post(':token/unlock')
  async unlock(@Param('token') token: string, @Body() body: { pin: string }) {
    return this.publicService.unlock(token, body.pin);
  }
}