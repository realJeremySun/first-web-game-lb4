import {Getter, Setter, inject, Provider} from '@loopback/context';
import {Request} from '@loopback/rest';
import {AuthorizationBindings} from '../keys';
import {AuthorizationMetadata,
        AuthorizeFn,
        UserProfile,
        AuthorizationStrategy
} from '../types';

export class AuthorizeActionProvider implements Provider<AuthorizeFn> {
  constructor(
    @inject.getter(AuthorizationBindings.METADATA)
    private readonly getMetadata: Getter<AuthorizationMetadata>,
    @inject.getter(AuthorizationBindings.STRATEGY)
    readonly getStrategy: Getter<AuthorizationStrategy>,
    @inject.setter(AuthorizationBindings.CURRENT_USER, {optional: true})
    readonly setCurrentUser: Setter<UserProfile>,
  ) {}

  value(): AuthorizeFn {
    return request => this.action(request);
  }

  async action(request: Request): Promise<UserProfile | undefined> {
    if ( !(await this.getMetadata())) {
      return undefined;
    }
    const strategy = await this.getStrategy();

    const user = await strategy.authorize(request);

    if (user) this.setCurrentUser(user);
    return user;
  }
}
