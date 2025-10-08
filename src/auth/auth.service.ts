
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService:JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUserName(username);
    if (user) {
        const isValid=this.usersService.checkUserPassword(pass,user.password);
        if(isValid===true){
            return user;
        }
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, id: user._id, name: user.name, };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
