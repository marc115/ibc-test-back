import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto){
    return this.loginService.register(registerUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDTO: LoginUserDTO){
    return this.loginService.login(loginUserDTO);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(){
    return 'Hola Mundo private'
  }
}
