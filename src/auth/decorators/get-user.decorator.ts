//No tiene proposito real. Es solo para fines educativos
import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();
        const user = req.user.email;

        if(!user){
            throw new InternalServerErrorException('User not found in request');
        }
        return (!data) ? user : user[data]
    }
);