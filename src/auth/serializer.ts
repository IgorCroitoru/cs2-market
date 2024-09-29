import { Inject, Injectable, ClassSerializerInterceptor } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../users/users.model';
// import { UsersService } from 'src/users/users.service';
import { InjectModel } from '@nestjs/sequelize';
import { AuthService } from './auth.service';
import { UserDto } from 'src/Dtos/UserDto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject()
    private readonly userService:UsersService,
  ) {
    super();
  }

  serializeUser(user: User, done: Function) {
    done(null, new UserDto(user));
  }

  async deserializeUser(userDto: UserDto, done: Function) {
    const user = await this.userService.findOne(userDto.id)
    return user ? done(null, user) : done(null, null);
  }
}