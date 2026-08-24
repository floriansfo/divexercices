import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('requests')
@UseGuards(AuthGuard('jwt'))
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}
  @Post()
  async create(@Request() req, @Body() body: { title: string; expectedFileCount: number; validityDays: number }) {
    return this.requestsService.create(req.user.id, body.title, body.expectedFileCount, body.validityDays);
  }

  @Get()
  async findAll(@Request() req) {
    return this.requestsService.findAllByOwner(req.user.id);
  }
}
