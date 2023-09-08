import { vendors, wrapper } from '@jmrl23/express-helper';

export const authorizationMiddleware = function authorizationMiddleware(
  authorizationType: AuthorizationType,
) {
  const [callback] = wrapper(function main(request, _response, next) {
    if (authorizationType === AuthorizationType.WITH_USER && !request.user) {
      throw new vendors.httpErrors.Unauthorized();
    }

    next();
  });

  return callback;
};

export enum AuthorizationType {
  WITH_USER,
}
