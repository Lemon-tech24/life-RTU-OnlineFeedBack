import {
  type JwtPayload,
  sign as _sign,
  verify as _verify,
  type SignOptions,
} from 'jsonwebtoken';

export class JwtService {
  private static instance: JwtService;
  private static secret: string = process.env.JWT_SECRET ?? 'keyboard_cat';

  public static async getInstance(): Promise<JwtService> {
    if (!JwtService.instance) {
      JwtService.instance = new JwtService();
    }

    return JwtService.instance;
  }

  public sign(payload: JwtPayload, signOptions: SignOptions = {}): string {
    return _sign(payload, JwtService.secret, signOptions);
  }

  public verify<T extends object & JwtPayload>(token: string): null | T {
    try {
      const result = _verify(token, JwtService.secret) as T;

      return result;
    } catch (error: unknown) {
      return null;
    }
  }
}
