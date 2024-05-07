import { IsEmail, IsMobilePhone, IsString, MaxLength, MinLength } from "class-validator"

export class RegisterUserDto {
    @IsString()
    @MinLength(2)
    names: string

    @IsString()
    @MinLength(2)
    lastNames: string

    @IsEmail()
    email: string

    @IsString()
    @MinLength(5)
    @MaxLength(64)
    password: string

    @IsString()
    @IsMobilePhone()
    phone: string
}