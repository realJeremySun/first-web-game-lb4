import {Component, ProviderMap} from '@loopback/core';
import {AuthorizationBindings} from './keys';
import {AuthorizeActionProvider} from './providers/authorization-action.provider';
import {AuthorizationMetadataProvider} from './providers/authorization-metadata.provider';
import {UserPermissionsProvider} from './providers/user-permissions.provider';

export class AuthorizationComponent implements Component {
  providers?: ProviderMap;

  constructor() {
    this.providers = {
      [AuthorizationBindings.AUTHORIZE_ACTION.key]: AuthorizeActionProvider,
      [AuthorizationBindings.METADATA.key]: AuthorizationMetadataProvider,
      [AuthorizationBindings.USER_PERMISSIONS.key]: UserPermissionsProvider,
    };
  }
}
