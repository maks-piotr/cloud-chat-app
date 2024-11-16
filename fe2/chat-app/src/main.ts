import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { Amplify } from 'aws-amplify';

// Amplify.configure({
//   Auth: {
//     Cognito: {
//       userPoolId: 'us-east-1_uqVYJ45ln',
//       userPoolClientId: '7s8cbbjpdgdnv603nerg2nf5eg',
//       signUpVerificationMethod: 'code',
//           loginWith: {
//             username: true
//           }
      
//     }
//   }
// });

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
