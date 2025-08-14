import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { CreateUserService } from './services/create-user.service';
import { ListUsersService } from './services/list-users.service';
import { FindUserByIdService } from './services/find-user-by-id.service';
import { UpdateUserService } from './services/update-user.service';
import { DeleteUserService } from './services/delete-user.service';
import { CreateUserController } from './controllers/create-user.controller';
import { UpdateUserController } from './controllers/update-user.controller';
import { H2DatabaseService } from 'src/config/database.config';
import { ListUsersController } from './controllers/list-users.controller';
import { FindUserByIdController } from './controllers/find-user-by-id.controller';
import { DeleteUserController } from './controllers/delete-user.controller';

@Module({
  controllers: [
    CreateUserController,
    UpdateUserController,
    ListUsersController,
    FindUserByIdController,
    DeleteUserController,
  ],
  providers: [
    H2DatabaseService,
    UserRepository,
    CreateUserService,
    ListUsersService,
    FindUserByIdService,
    UpdateUserService,
    DeleteUserService,
  ],
  exports: [
    H2DatabaseService,
    UserRepository,
    FindUserByIdService,
    CreateUserService,
  ],
})
export class UsersModule {}
