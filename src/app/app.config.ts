import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { provideHttpClient } from '@angular/common/http'; // 1. IMPORTANTE: Importe o provider moderno

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    providePrimeNG({
            theme: {
                preset: Aura,
            }
        }),
    provideRouter(routes)
  ]
};
