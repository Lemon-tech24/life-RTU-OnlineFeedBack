import { Prisma } from '@prisma/client';

export declare type UserWithPostsLikesAndComments = Prisma.UserGetPayload<{
  include: {
    user_information: true;
    posts: true;
    likes: true;
    comments: true;
  };
}>;
