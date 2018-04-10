import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AuthGuard } from '../auth/guards/auth';
import { SubjectsPageComponent } from './containers/subjects.component';
import { SharedModule } from '../shared/shared.module';

const SUBJECTS_DIALOG_COMPONENTS = [];

export const SUBJECTS_COMPONENTS = [
	SubjectsPageComponent,
	...SUBJECTS_DIALOG_COMPONENTS
];

@NgModule({
	declarations: [SUBJECTS_COMPONENTS],
	imports: [
		CommonModule,
		FlexLayoutModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		SharedModule,
		RouterModule.forChild([
			{
				path: 'subjects',
				component: SubjectsPageComponent,
				canActivate: [AuthGuard]
			}
		])
	],
	exports: [SUBJECTS_COMPONENTS],
	providers: []
})
export class SubjectsModule {}
