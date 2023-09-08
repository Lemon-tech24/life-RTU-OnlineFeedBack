import { PrismaClient } from '@prisma/client';

export class PrismaService {
  private static instance: PrismaService;

  private constructor(private readonly prismaClient: PrismaClient) {}

  public static async getInstance(): Promise<PrismaService> {
    if (!PrismaService.instance) {
      const instance = new PrismaService(new PrismaClient());

      PrismaService.instance = instance;
    }

    return PrismaService.instance;
  }

  public async getPrismaClient(): Promise<PrismaClient> {
    return this.prismaClient;
  }
}
