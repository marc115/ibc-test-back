import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService
  ) { }

  async register(registerUserDto: RegisterUserDto) {
    try {
      const newUser = await this.prisma.newuser.create({
        data: {
          ...registerUserDto,
          password: bcrypt.hashSync(registerUserDto.password, 10)
        }
      });

      delete newUser.password;

      return {
        names: newUser.names,
        lastName: newUser.lastNames,
        email: newUser.email.toLowerCase(),
        token: this.getJwToken({ id: newUser.id })
      };

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
    //comprobar que las contraseñas coincidan
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException("Las credenciales no son válidas")
    }
    //comprobar que el usuario esté activo
    if(!user.isActive){
      throw new ForbiddenException("No tiene privilegios para esta acción")
    }

    return {
      names: user.names,
      lastName: user.lastNames,
      email: user.email,
      token: this.getJwToken({ id: user.id })
    }
  }

  private getJwToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

}
