import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import '../styles/styles.scss';
import '../styles/headings.css';
/*
 * Platform and Environment providers/directives/pipes
 */
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { NavBarModule } from './shared/navbar/navbar.module';
import { NoContentComponent } from './no-content';
import { Api } from './services/api';
import { ErrorInterceptor } from './interceptors/error';
import { UserData } from './providers/user-data';
import { AuthGuard } from './guards/auth';
import { NoAuthGuard } from './guards/no-auth';
import { LoginPageComponent } from './pages/login/login.component';
import { TemplatesPageComponent } from './pages/templates/templates.component';
import { TemplatesData } from './providers/templates-data';
import { TemplatesModule } from './pages/templates/templates.module';

// Application wide providers
const APP_PROVIDERS = [
  Api,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
  },
  UserData,
  TemplatesData,
  AuthGuard,
  NoAuthGuard
];


/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    LoginPageComponent,
    NoContentComponent,
  ],
  /**
   * Import Angular's modules.
   */
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, {
      useHash: Boolean(history.pushState) === false,
      preloadingStrategy: PreloadAllModules
    }),
    NavBarModule,
    TemplatesModule
    /**
     * This section will import the `DevModuleModule` only in certain build types.
     * When the module is not imported it will get tree shaked.
     * This is a simple example, a big app should probably implement some logic
     */
    // ...environment.showDevModule ? [ DevModuleModule ] : [],
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    APP_PROVIDERS
  ]
})
export class AppModule {}
