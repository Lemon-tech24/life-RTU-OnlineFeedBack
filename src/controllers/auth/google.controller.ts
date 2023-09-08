import { vendors, wrapper } from '@jmrl23/express-helper';
import { Router } from 'express';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { JwtService } from '../../services/jwt.service';
import { PrismaService } from '../../services/prisma.service';
import passport from 'passport';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL ?? '',
      scope: ['profile', 'email'],
    },
    async function (_accessToken, _refreshToken, profile, done) {
      const prismaService = await PrismaService.getInstance();
      const prismaClient = await prismaService.getPrismaClient();
      const user = await prismaClient.user.findUnique({
        where: {
          google_id: profile.id,
        },
      });

      if (user) {
        return done(null, user.id);
      }

      if (!profile._json.email) {
        return done(new Error('No email'));
      }

      const newUser = await prismaClient.user.create({
        data: {
          google_id: profile.id,
          email: profile._json.email,
          user_information: {
            create: {
              display_name: profile.displayName,
            },
          },
        },
      });

      done(newUser.id);
    },
  ),
);

export const controller = Router();

controller
  .get(
    '/',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: 'select_account',
      session: false,
    }),
  )

  .get(
    '/callback',
    wrapper(function (request, response, next) {
      passport.authenticate(
        'google',
        { session: false },
        async function (error, id) {
          if (error) {
            next(new vendors.httpErrors.InternalServerError('An error occurs'));

            return;
          }

          if (!id) {
            next(new vendors.httpErrors.Unauthorized());

            return;
          }

          const jwtService = await JwtService.getInstance();
          const token = jwtService.sign(
            {
              id,
            },
            {
              expiresIn: '30d',
            },
          );

          response.redirect(`${process.env.CLIENT_URL}/token=${token}`);
        },
      )(request, response, next);
    }),
  );
