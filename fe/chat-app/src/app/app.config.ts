import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(appRoutes), provideClientHydration(), provideAnimationsAsync(), provideAnimationsAsync(), importProvidersFrom(
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  )]
};
