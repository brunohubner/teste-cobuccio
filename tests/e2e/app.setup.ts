import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';

export class App {
  private static app: INestApplication;

  public static async getApp(): Promise<INestApplication> {
    if (!this.app) {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      this.app = moduleFixture.createNestApplication();
      this.app.useGlobalPipes(new ValidationPipe());
      await this.app.init();
    }

    return this.app;
  }
}
