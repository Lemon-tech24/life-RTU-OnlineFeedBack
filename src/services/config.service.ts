export class ConfigService {
  private static instance: ConfigService;

  private constructor(private readonly memory: Map<string, unknown>) {}

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      const instance = new ConfigService(new Map<string, unknown>());

      ConfigService.instance = instance;
    }

    return ConfigService.instance;
  }

  public set(key: string, value: unknown): void {
    this.memory.set(key, value);
  }

  public get<T>(key: string): T | undefined {
    const env = process.env;

    if (key in env) {
      return env[key] as T;
    }

    if (this.memory.has(key)) {
      return this.memory.get(key) as T;
    }

    return void 0;
  }
}
