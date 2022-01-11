import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
import { AuthService, KeycloakToken } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private _authService: AuthService) {}

  @Get('login')
  @Redirect('', 301)
  @Unprotected()
  login() {
    console.log('Login...');
    return this._authService.getUrlLogin();
  }

  @Get('me')
  getMe(@Headers('Authorization') token: string) {
    return this._authService.getMe(token);
  }

  @Get('callback')
  @Unprotected()
  getAccessToken(@Query('code') code: string) {
    return this._authService.getAccessToken(code);
  }

  @Post('refreshToken')
  @Unprotected()
  refreshAccessToken(@Body() token: KeycloakToken) {
    return this._authService.refreshAccessToken(token.refreshToken);
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Body('refreshToken') refreshToken: string) {
    return this._authService.logout(refreshToken);
  }

  @Post('create')
  create(@Headers('Authorization') token: string, @Body() user: any) {
    return this._authService.create(token, user);
  }
}
