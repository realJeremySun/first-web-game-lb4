import {MethodDecoratorFactory} from '@loopback/core';
import {AuthorizationMetadata} from '../types';
import {AUTHORIZATION_METADATA_ACCESSOR} from '../keys';
import {PermissionKey} from '../permission-key';

export function authorize(permissions: PermissionKey[]) {
  return MethodDecoratorFactory.createDecorator<AuthorizationMetadata>(
    AUTHORIZATION_METADATA_ACCESSOR,
    {
      permissions: permissions,
    },
  );
}
