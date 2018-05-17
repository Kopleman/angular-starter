import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AuthGuard } from '../auth/guards/auth';
import { SchemePageComponent } from './containers/scheme.component';
import { SchemeData } from './services/scheme-data.service';

const SCHEME_DIALOG_COMPONENTS = [];

const SCHEME_COMPONENTS = [
	SchemePageComponent,
	...SCHEME_DIALOG_COMPONENTS
];

const SCHEME_PROVIDERS = [SchemeData];

@NgModule({
	declarations: [SCHEME_COMPONENTS],
	imports: [
		CommonModule,
		FlexLayoutModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		RouterModule.forChild([
			{
				path: 'scheme',
				component: SchemePageComponent,
				canActivate: [AuthGuard],
			}
		])
	],
	entryComponents: SCHEME_DIALOG_COMPONENTS,
	exports: [SCHEME_COMPONENTS],
	providers: [SCHEME_PROVIDERS]
})
export class SchemeModule {}
