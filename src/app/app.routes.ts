import { Routes } from '@angular/router';
import { NoContentComponent } from './no-content';

export const ROUTES: Routes = [
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
	{ path: '**', component: NoContentComponent }
];
