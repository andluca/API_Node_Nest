import { Global, Module } from '@nestjs/common';
import { H2DatabaseService } from './database.config';

@Global()
@Module({
  providers: [H2DatabaseService],
  exports: [H2DatabaseService],
})
export class DatabaseModule {}
