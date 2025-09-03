import { Injectable } from '@nestjs/common';

@Injectable()
export class SsoJwtService {
  async validateToken(token: string): Promise<any> {
    // Stub implementation
    return {
      valid: true,
      payload: { sub: 'test-user' },
    };
  }
}