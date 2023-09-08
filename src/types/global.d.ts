import { UserWithPostsLikesAndComments } from './user';

declare global {
  namespace Express {
    interface Request {
      user?: UserWithPostsLikesAndComments;
    }
  }
}
