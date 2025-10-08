import { IsString, IsInt, IsNotEmpty, IsEmail, IsEmpty, } from 'class-validator';

export class CreateUserDto {
   
    @IsString()
    readonly name: string;
    @IsEmpty()
    readonly age: number;
    @IsEmail({},{message:"Email không đúng định dạng"})
    @IsNotEmpty({message:"Không được để trống Email"})
    readonly email: string;
    readonly address: string;
    readonly phone: string;
    @IsNotEmpty({ message:"Không được để trống password"})
    readonly password: string;
}
