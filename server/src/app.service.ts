import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiInfo() {
    return {
      name: 'Basic MVP - Sàn giáo dục tiếng Anh 1-1 API',
      version: '1.0.0',
      description:
        'API cho sàn giáo dục tiếng Anh kết nối giáo viên và học viên',
      endpoints: {
        users: '/api/users',
        teachers: '/api/teachers',
        lessons: '/api/lessons',
        packages: '/api/packages',
        purchases: '/api/purchases',
      },
    };
  }
}
