import { NgModule, CUSTOM_ELEMENTS_SCHEMA, importProvidersFrom } from '@angular/core';
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
import { ChatLogComponent } from './components/chat-log/chat-log.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';



@NgModule({
  declarations: [
     AppComponent,
     ChatComponent,  // Add ChatComponent to declarations
     ChatLogComponent,
     UsersListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatFormFieldModule, // Add all required Material modules here
    MatInputModule,
    MatButtonModule,
    FormsModule,
    AmplifyAuthenticatorModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    importProvidersFrom(HttpClientModule)
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})



export class AppModule {

  constructor() {
    
  }
 }

