// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingKey} from '@loopback/context';
import {JWTAuthenticationService} from './services/JWT.authentication.service';
import {JWTStrategy} from './authentication-strategies/JWT.strategy';

// Discussion point for reviewers:
// What would be the good naming conversion for bindings?
export namespace JWTAuthenticationBindings {
  export const STRATEGY = BindingKey.create<JWTStrategy>(
    'authentication.strategies.jwt.strategy',
  );
  export const SECRET = BindingKey.create<string>('authentication.jwt.secret');
  export const SERVICE = BindingKey.create<JWTAuthenticationService>(
    'services.authentication.jwt.service',
  );
}
