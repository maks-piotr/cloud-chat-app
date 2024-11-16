import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ChatComponent } from './components/chat/chat.component';
import { FormsModule } from '@angular/forms';
import { Amplify } from '@aws-amplify/core';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';

// export const awsconfig = {
//   aws_project_region: 'us-east-1',  // Replace with your own region
//   aws_cognito_region: 'us-east-1',
//   aws_user_pools_id: 'us-east-1_uqVYJ45ln',            // Add your own user-pool-id
//   aws_user_pools_web_client_id: '7s8cbbjpdgdnv603nerg2nf5eg', // Add your own client-id
//   oauth: {
//     domain: 'cloud-chat-app.auth.us-east-1.amazoncognito.com',    // Add your own domain-url
//     scope: [
//       'phone',
//       'email',
//       'openid',
//       'profile',
//       'aws.cognito.signin.user.admin'
//     ],
//     redirectSignIn: 'http://localhost:4200',    // Add your own redirect sign-in url
//     redirectSignOut: 'http://localhost:4200',   // Add your own redirect sign-out url
//     responseType: 'code'
//   }
// };

// Amplify.configure(awsconfig)



// Amplify.configure({
//   Auth: {
//     Cognito: {
//       userPoolId: 'us-east-1_uqVYJ45ln',
//       userPoolClientId: '7s8cbbjpdgdnv603nerg2nf5eg',
//       loginWith: { // Optional
//         oauth: {
//           domain: 'cloud-chat-app.auth.us-east-1.amazoncognito.com',
//           scopes: ['openid email phone profile aws.cognito.signin.user.admin '],
//           redirectSignIn: ['http://localhost:4200'],
//           redirectSignOut: ['http://localhost:4200'],
//           responseType: 'code',
//         },
//         username: true
//       }
//     }
//   }
// });


@NgModule({
  declarations: [
     AppComponent,
     ChatComponent,  // Add ChatComponent to declarations
    //  RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatFormFieldModule, // Add all required Material modules here
    MatInputModule,
    MatButtonModule,
    FormsModule,
    AmplifyAuthenticatorModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})



export class AppModule {

  constructor() {
    
  }
 }

