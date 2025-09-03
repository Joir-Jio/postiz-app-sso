/**
 * Test environment utilities
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { DatabaseModule } from '@gitroom/nestjs-libraries/database/prisma/database.module';

export class TestEnvironment {
  private app: INestApplication;
  private prisma: PrismaService;

  async setup(): Promise<void> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
      ],
      providers: [PrismaService],
    }).compile();

    this.app = moduleFixture.createNestApplication();
    this.prisma = moduleFixture.get<PrismaService>(PrismaService);
    
    await this.app.init();
  }

  async cleanup(): Promise<void> {
    if (this.app) {
      await this.app.close();
    }
  }

  getApp(): INestApplication {
    return this.app;
  }

  async createTestOrganization(data: any): Promise<any> {
    return this.prisma.organization.create({
      data: {
        name: data.name || 'Test Organization',
        tier: data.tier || 'FREE',
        disabled: false,
        ...data,
      },
    });
  }

  async createTestUser(data: any): Promise<any> {
    return this.prisma.user.create({
      data: {
        email: data.email || `test-${Date.now()}@example.com`,
        name: data.name || 'Test User',
        organizationId: data.organizationId,
        disabled: false,
        ...data,
      },
    });
  }

  async cleanDatabase(): Promise<void> {
    // Clean up test data
    await this.prisma.user.deleteMany({
      where: {
        email: { contains: 'test-' }
      }
    });

    await this.prisma.organization.deleteMany({
      where: {
        name: { contains: 'Test' }
      }
    });
  }
}