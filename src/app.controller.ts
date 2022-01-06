import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('aqui');
    return this.appService.getHello();
  }

  @Get('/v1')
  getShit(): string {
    console.log('aqui');
    return this.appService.getHello();
  }
}
