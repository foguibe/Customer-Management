
import { ApplicationConfig } from '@angular/core';
import { appRoutes } from './app-routing.module';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [appRoutes, provideClientHydration()]
};

