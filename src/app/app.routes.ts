import { Routes } from '@angular/router';
import { NoContentComponent } from './no-content';
import { LoginPageComponent } from './auth/containers/login.component';
import { TemplatesPageComponent } from './templates/containers/templates.component';
import { AuthGuard } from './auth/guards/auth';
import { NoAuthGuard } from './auth/guards/no-auth';

export const ROUTES: Routes = [
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
	// { path: 'login', component: LoginPageComponent, canActivate: [ NoAuthGuard ] },
	// { path: 'templates', component: TemplatesPageComponent, canActivate: [ AuthGuard ] },
	{ path: '**', component: NoContentComponent }
];
