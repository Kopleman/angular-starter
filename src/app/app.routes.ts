import { Routes, CanActivate } from '@angular/router';
import { NoContentComponent } from './no-content';
import { LoginPageComponent } from './pages/login/login.component';
import { TemplatesPageComponent } from './pages/templates/templates.component';
import { AuthGuard } from './guards/auth';
import { NoAuthGuard } from './guards/no-auth';

export const ROUTES: Routes = [
	{ path: '', component: LoginPageComponent, canActivate: [ NoAuthGuard ] },
	{ path: 'login', component: LoginPageComponent, canActivate: [ NoAuthGuard ] },
	{ path: 'templates', component: TemplatesPageComponent, canActivate: [ AuthGuard ] },
	{ path: '**', component: NoContentComponent }
];
