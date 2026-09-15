import { Module } from '@nestjs/common';
import { SpaceOwnersController } from './space-owners.controller';
import { SpaceOwnersService } from './space-owners.service';

@Module({
  controllers: [SpaceOwnersController],
  providers: [SpaceOwnersService],
  exports: [SpaceOwnersService],
})
export class SpaceOwnersModule {}
