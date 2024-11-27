import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { Amplify } from 'aws-amplify';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
