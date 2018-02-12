import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { AppComponent } from './containers/app.component';
import { NoContentComponent } from './containers/no-content.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from '../auth/guards/auth';
import { NoAuthGuard } from '../auth/guards/no-auth';
import { ErrorInterceptor } from './interceptors/error';
import { Api } from './services/api';
import { AuthService } from '../auth/services/auth.service';
import { NavBarComponent } from './components/navbar/navbar.component';
import { MaterialModule } from '../material';


export const COMPONENTS = [
  AppComponent,
  NoContentComponent,
  NavBarComponent
];

// Application wide providers
export const APP_PROVIDERS = [
  Api,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
  },
  AuthService,
  AuthGuard,
  NoAuthGuard
];

@NgModule({
  imports: [CommonModule, RouterModule, MaterialModule],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: APP_PROVIDERS
})
export class CoreModule {}
