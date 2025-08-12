import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { CreateUserService } from './services/create-user.service';
import { ListUsersService } from './services/list-users.service';
import { FindUserByIdService } from './services/find-user-by-id.service';
import { UpdateUserService } from './services/update-user.service';
import { DeleteUserService } from './services/delete-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserRepository,
    CreateUserService,
    ListUsersService,
    FindUserByIdService,
    UpdateUserService,
    DeleteUserService,
  ],
  exports: [FindUserByIdService],
})
export class UsersModule {}
