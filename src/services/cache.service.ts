import { caching, type MemoryCache } from 'cache-manager';

export class CacheService {
  private static instance: CacheService;

  private constructor(private readonly manager: MemoryCache) {}

  public static async getInstance(): Promise<CacheService> {
    if (!CacheService.instance) {
      const instance = new CacheService(
        await caching('memory', {
          ttl: 1000 * 30,
        }),
      );

      CacheService.instance = instance;
    }

    return CacheService.instance;
  }

  public getManager(): MemoryCache {
    return this.manager;
  }
}
