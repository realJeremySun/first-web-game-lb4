import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import * as path from 'path';
import {MySequence} from './sequence';
//add
import {HttpErrors} from '@loopback/rest';
import {AuthorizationComponent, AuthorizationBindings, JWTStrategy, JWT_SECRET, UserProfile} from './authorization';


export class FirstgameApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    //add
    // Bind authentication component related elements
    this.component(AuthorizationComponent);



    // Bind JWT authentication strategy related elements
    this.bind(AuthorizationBindings.STRATEGY).toClass(JWTStrategy);
    this.bind(AuthorizationBindings.SECRET).to(JWT_SECRET);
    //this.bind(AuthorizationBindings.CURRENT_USER).to(Credentials);




    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
