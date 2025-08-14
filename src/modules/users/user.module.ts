import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { CreateUserService } from './services/create-user.service';
import { ListUsersService } from './services/list-users.service';
import { FindUserByIdService } from './services/find-user-by-id.service';
import { UpdateUserService } from './services/update-user.service';
import { DeleteUserService } from './services/delete-user.service';
import { CreateUserController } from './controllers/create-user.controller';
import { UpdateUserController } from './controllers/update-user.controller';
import { ListUsersController } from './controllers/list-users.controller';
import { FindUserByIdController } from './controllers/find-user-by-id.controller';
import { DeleteUserController } from './controllers/delete-user.controller';
import { DatabaseModule } from 'src/config/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateUserController,
    UpdateUserController,
    ListUsersController,
    FindUserByIdController,
    DeleteUserController,
  ],
  providers: [
    UserRepository,
    CreateUserService,
    ListUsersService,
    FindUserByIdService,
    UpdateUserService,
    DeleteUserService,
  ],
  exports: [UserRepository, FindUserByIdService, CreateUserService],
})
export class UsersModule {}
