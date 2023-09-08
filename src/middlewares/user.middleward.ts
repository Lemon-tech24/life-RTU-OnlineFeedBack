import { type RequestHandler } from 'express';
import { CacheService } from '../services/cache.service';
import { UserService } from '../services/user.service';

export const userMiddleware = async function userMiddleware(
  request,
  _response,
  next,
) {
  const [scheme, token] = request.header('authorization')?.split(' ') ?? [];

  if (scheme !== 'Bearer') return next();

  const userService = await UserService.getInstance();
  const user = await userService.userReadByToken(token);
  const cacheService = await CacheService.getInstance();
  const cacheManager = cacheService.getManager();

  if (user) {
    request.user = user;

    await cacheManager.set(
      `UserService[user][${user.id}]`,
      user,
      1000 * 5 * 60,
    );
  }

  next();
} satisfies RequestHandler;
