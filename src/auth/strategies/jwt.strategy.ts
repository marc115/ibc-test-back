import { PassportStrategy } from "@nestjs/passport";
import { newuser } from "@prisma/client";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private prisma: PrismaService) {
        super({
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate (payload: JwtPayload): Promise<newuser> {
        const {id} = payload

        const user = await this.prisma.newuser.findFirst({
            where: {
                id: id
            }
        });

        if (!user || !user.isActive){
            throw new UnauthorizedException("Token not valid")
        }

        return user;
    }
}