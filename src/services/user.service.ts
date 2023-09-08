import { CacheService } from './cache.service';
import { PrismaService } from './prisma.service';
import { UserCreateDto } from '../dtos/user/create.dto';
import { UserReadDto } from '../dtos/user/read.dto';
import { UserListDto } from '../dtos/user/list.dto';
import { UserUpdateDto } from '../dtos/user/update.dto';
import { UserDeleteDto } from '../dtos/user/delete.dto';
import type { UserWithPostsLikesAndComments } from '../types/user';

export class UserService {
  private static instance: UserService;

  private constructor(
    private readonly cacheService: CacheService,
    private readonly prismaService: PrismaService,
  ) {}

  public static async getInstance(): Promise<UserService> {
    if (!UserService.instance) {
      const instance = new UserService(
        await CacheService.getInstance(),
        await PrismaService.getInstance(),
      );

      UserService.instance = instance;
    }

    return UserService.instance;
  }

  public async userCreate(
    userCreateDto: UserCreateDto,
  ): Promise<UserWithPostsLikesAndComments> {
    const cacheManager = this.cacheService.getManager();
    const prismaClient = await this.prismaService.getPrismaClient();
    const user = await prismaClient.user.create({
      data: {
        email: userCreateDto.email,
        google_id: userCreateDto.google_id,
        user_information: !userCreateDto.user_information
          ? void 0
          : {
              create: userCreateDto.user_information,
            },
      },
      include: {
        user_information: true,
        posts: true,
        likes: true,
        comments: true,
      },
    });
    const cacheKey = `UserService[user][${user.id}]`;

    await cacheManager.set(cacheKey, user);

    return user;
  }

  public async userRead(
    userReadDto: UserReadDto,
  ): Promise<UserWithPostsLikesAndComments | null> {
    const cacheManager = this.cacheService.getManager();
    const cacheKey = `UserService[user][${userReadDto.id}]`;
    const cachedData = await cacheManager.get<UserWithPostsLikesAndComments>(
      cacheKey,
    );

    if (cachedData) {
      return cachedData;
    }

    const prismaClient = await this.prismaService.getPrismaClient();
    const user = await prismaClient.user.findFirst({
      where: {
        id: userReadDto.id,
      },
      include: {
        user_information: true,
        posts: true,
        likes: true,
        comments: true,
      },
    });

    if (user) {
      await cacheManager.set(cacheKey, user);
    }

    return user;
  }

  public async userList(
    userListDto: UserListDto,
  ): Promise<UserWithPostsLikesAndComments[]> {
    const cacheManager = this.cacheService.getManager();
    const cacheKey = `UserService[list][${JSON.stringify(userListDto)}]`;
    const cachedData = await cacheManager.get<UserWithPostsLikesAndComments[]>(
      cacheKey,
    );

    if (cachedData) {
      return cachedData;
    }

    const prismaClient = await this.prismaService.getPrismaClient();
    const _userList = await prismaClient.user.findMany({
      where: {
        email: userListDto.email,
        user_information: userListDto.user_information,
      },
      include: {
        user_information: true,
        posts: true,
        likes: true,
        comments: true,
      },
      skip: userListDto.skip,
      take: userListDto.take,
      orderBy: {
        created_at: 'desc',
      },
    });

    await cacheManager.set(cacheKey, userListDto);

    return _userList;
  }

  public async userUpdate(
    userUpdateDto: UserUpdateDto,
  ): Promise<UserWithPostsLikesAndComments> {
    const cacheManager = this.cacheService.getManager();
    const cacheKey = `UserService[user][${userUpdateDto.id}]`;
    const prismaClient = await this.prismaService.getPrismaClient();
    const user = await prismaClient.user.update({
      where: {
        id: userUpdateDto.id,
      },
      data: {
        user_information: {
          update: {
            data: userUpdateDto.user_information,
          },
        },
      },
      include: {
        user_information: true,
        posts: true,
        likes: true,
        comments: true,
      },
    });

    await cacheManager.set(cacheKey, user);

    return user;
  }

  public async userDelete(
    userDeleteDto: UserDeleteDto,
  ): Promise<UserWithPostsLikesAndComments> {
    const cacheManager = this.cacheService.getManager();
    const cacheKey = `UserService[user][${userDeleteDto.id}]`;
    const prismaClient = await this.prismaService.getPrismaClient();
    const user = await prismaClient.user.delete({
      where: {
        id: userDeleteDto.id,
      },
      include: {
        user_information: true,
        posts: true,
        likes: true,
        comments: true,
      },
    });

    await cacheManager.del(cacheKey);

    return user;
  }
}
