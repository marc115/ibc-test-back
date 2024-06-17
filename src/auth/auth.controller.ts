import { Controller, Get, Post, Body, HttpCode,} from '@nestjs/common';
import { newuser } from '@prisma/client';

import { AuthService } from './auth.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { GetUser } from './decorators/get-user.decorator';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginService: AuthService) { }

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.loginService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginUserDTO: LoginUserDTO) {
    return this.loginService.login(loginUserDTO);
  }
  
  @Get('private2')
  @Auth()
  testingPrivateRoute2() {
    return 'auth passed'
  }
}
