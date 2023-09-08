import { Router } from 'express';
import { validate, vendors, wrapper } from '@jmrl23/express-helper';
import { UserService } from '../services/user.service';
import { UserCreateDto } from '../dtos/user/create.dto';
import { UserUpdateDto } from '../dtos/user/update.dto';
import { UserReadDto } from '../dtos/user/read.dto';
import { UserListDto } from '../dtos/user/list.dto';
import { UserDeleteDto } from '../dtos/user/delete.dto';
import {
  AuthorizationType,
  authorizationMiddleware,
} from '../middlewares/authorization.middleware';

export const controller = Router();

controller

  .post(
    '/create',
    validate('BODY', UserCreateDto),
    wrapper(async function (request) {
      const userService = await UserService.getInstance();
      const user = await userService.userCreate(request.body);

      return {
        user,
      };
    }),
  )

  .get(
    '/session',
    wrapper(function (request) {
      const user = request.user ?? null;

      return {
        user,
      };
    }),
  )

  .use(authorizationMiddleware(AuthorizationType.WITH_USER))

  .get(
    '/read/:id',
    validate('PARAMS', UserReadDto),
    wrapper(async function (request) {
      const userService = await UserService.getInstance();
      const user = await userService.userRead({
        ...request.params,
      } as unknown as UserReadDto);

      return {
        user,
      };
    }),
  )

  .post(
    '/list',
    validate('BODY', UserListDto),
    wrapper(async function (request) {
      const userService = await UserService.getInstance();
      const users = await userService.userList(request.body);

      return {
        users,
      };
    }),
  )

  .patch(
    '/update',
    validate('BODY', UserUpdateDto),
    wrapper(async function (request) {
      if (request.user && request.user !== request.body.id) {
        throw new vendors.httpErrors.Unauthorized(
          "Cannot modify other user's data",
        );
      }

      const userService = await UserService.getInstance();
      const user = await userService.userUpdate(request.body);

      return {
        user,
      };
    }),
  )

  .delete(
    '/delete/:id',
    validate('PARAMS', UserDeleteDto),
    wrapper(async function (request) {
      if (request.user && request.user !== request.body.id) {
        throw new vendors.httpErrors.Unauthorized(
          "Cannot delete other user's data",
        );
      }

      const userService = await UserService.getInstance();
      const user = await userService.userDelete(
        request.params as unknown as UserDeleteDto,
      );

      return {
        user,
      };
    }),
  );
