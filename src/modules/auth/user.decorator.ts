import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.model';

export const AuthUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!request?.user) throw new Error('User not found');

    const user = new User(
      request.user.id,
      request.user.name,
      request.user.email,
    );

    return data ? user?.[data] : user;
  },
);
