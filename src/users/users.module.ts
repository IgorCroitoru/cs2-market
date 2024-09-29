import { forwardRef, Module } from '@nestjs/common';
 import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
