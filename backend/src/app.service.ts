import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Coworking Space API - Smart Space Booking';
  }
}
