import { join } from 'node:path';
import express from 'express';
import { corsMiddleware } from './middlewares/cors.middleware';
import { morganMiddleware } from './middlewares/morgan.middleware';
import { logger } from './utils/logger';
import {
  errorHandler,
  registerControllers,
  wrapper,
  vendors,
} from '@jmrl23/express-helper';
import passport from 'passport';
import { prismaError as PrismaError } from 'prisma-better-errors';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { userMiddleware } from './middlewares/user.middleward';

const app = express();

// middlewares
app.use(
  passport.initialize(),
  morganMiddleware(),
  corsMiddleware({ origin: '*' }),
  express.json(),
  express.urlencoded({ extended: false }),
  userMiddleware,
);

// public directory
app.use(express.static(join(__dirname, '../public')));

// controllers/ routes
const controllers = registerControllers(
  join(__dirname, './controllers'),
  '/',
  (controllers) => {
    for (const { filePath, controller } of controllers) {
      logger.info(`Controller {${controller}} -> ${filePath}`);
    }
  },
);
app.use(controllers);

app.use(
  // 404 response
  wrapper((request) => {
    throw new vendors.httpErrors.NotFound(
      `Cannot ${request.method} ${request.path}`,
    );
  }),
  // custom error handlers
  errorHandler(
    (error, _request, _response, next) => {
      if (error instanceof PrismaClientKnownRequestError) {
        error = new PrismaError(error);
      }

      next(error);
    },
    (error, _request, response, next) => {
      if (!(error instanceof vendors.httpErrors.HttpError)) {
        if ('statusCode' in error && typeof error.statusCode === 'number') {
          error = vendors.httpErrors.createHttpError(
            error.statusCode,
            error.message,
          );
        }
      }

      if (error instanceof vendors.httpErrors.HttpError) {
        const data = {
          statusCode: error.statusCode,
          message: error.message,
          error: error.constructor.name,
        };

        logger.error(error.stack);

        return response.status(error.statusCode).json(data);
      }

      next(error);
    },
  ),
);

export default app;
