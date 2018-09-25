import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AuthGuard } from '../auth/guards/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nSchemePageComponent } from './containers/i18n-scheme.component';
import { TemplatesI18nData } from './services/template-i18n-data';
import { I18nSchemeGuard } from './guards/can-activate';

const I18N_SCHEME_DIALOG_COMPONENTS = [];

const I18N_SCHEME_COMPONENTS = [I18nSchemePageComponent];

const I18N_SCHEME_PROVIDERS = [TemplatesI18nData, I18nSchemeGuard];

@NgModule({
	declarations: [...I18N_SCHEME_COMPONENTS],
	imports: [
		CommonModule,
		FlexLayoutModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		RouterModule.forChild([
			{
				path: 'i18n',
				component: I18nSchemePageComponent,
				canActivate: [AuthGuard, I18nSchemeGuard]
			}
		])
	],
	entryComponents: [...I18N_SCHEME_DIALOG_COMPONENTS],
	exports: [...I18N_SCHEME_COMPONENTS],
	providers: [...I18N_SCHEME_PROVIDERS]
})
export class I18nSchemeModule {}
