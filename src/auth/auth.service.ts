import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDTO } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { } 
  
  async register(registerUserDto: RegisterUserDto){
    try {
      const newUser = await this.prisma.newuser.create({
        data: {
          ...registerUserDto,
          password: bcrypt.hashSync(registerUserDto.password, 10)
        }
      });

      delete newUser.password;
      return newUser;

    } catch (error) {
      console.log(error);
    }
  }

  async login(loginUserDto: LoginUserDTO) {
    const { password, email } = loginUserDto;

    const user = await this.prisma.newuser.findFirst({
      where: {
        email: email,
      }
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException("Credentials are not valid")
    }

    return {
      email: user.email,
      password: user.password
    }
  }

  
}
