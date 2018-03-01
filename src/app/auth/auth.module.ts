import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './containers/login.component';

import { MaterialModule } from '../material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth';
import { AuthGuard } from './guards/auth';
import { NoAuthGuard } from './guards/no-auth';
import { RootAuthModule } from './root-auth.module';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

export const COMPONENTS = [LoginPageComponent];

@NgModule({
	imports: [
		CommonModule,
		FlexLayoutModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		RouterModule.forChild([
			{
				path: 'login',
				component: LoginPageComponent,
				canActivate: [NoAuthGuard]
			}
		])
	],
	declarations: COMPONENTS,
	exports: COMPONENTS,
	providers: [AuthService, AuthGuard, NoAuthGuard]
})
export class AuthModule {}
