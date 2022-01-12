import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthUser } from './modules/auth/user.decorator';
import { User } from './modules/auth/user.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // getHello(@AuthUser('email') email: string): string {
  getHello(@AuthUser() user: User): string {
    return this.appService.getHello();
  }
}
