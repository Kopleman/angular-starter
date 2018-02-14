import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import '../styles/styles.scss';
import '../styles/headings.css';
/*
 * Platform and Environment providers/directives/pipes
 */
import { ROUTES } from './app.routes';

import { AppComponent } from './core/containers/app.component';
import { NavBarModule } from './core/components/navbar/navbar.module';
import { NoContentComponent } from './no-content';
import { Api } from './core/services/api';
import { ErrorInterceptor } from './core/interceptors/error';
import { AuthService } from './auth/services/auth.service'
import { AuthGuard } from './auth/guards/auth';
import { NoAuthGuard } from './auth/guards/no-auth';
import { LoginPageComponent } from './auth/containers/login.component';
import { TemplatesModule } from './templates/templates.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';

// Application wide providers
const APP_PROVIDERS = [];


/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  /**
   * Import Angular's modules.
   */
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, {
      useHash: Boolean(history.pushState) === false,
      preloadingStrategy: PreloadAllModules
    }),
    CoreModule,
    AuthModule,
    TemplatesModule
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    APP_PROVIDERS
  ]
})
export class AppModule {}
