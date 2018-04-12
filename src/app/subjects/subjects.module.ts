import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StoreModule } from '@ngrx/store';

import { AuthGuard } from '../auth/guards/auth';
import { SubjectsPageComponent } from './containers/subjects.component';
import { SharedModule } from '../shared/shared.module';
import { SubjectsData } from './services/subjects-data';
import { subjectsStateReducer, INITIAL_FILTERS_STATE } from './store/reducer';


const SUBJECTS_DIALOG_COMPONENTS = [];

export const SUBJECTS_COMPONENTS = [
	SubjectsPageComponent,
	...SUBJECTS_DIALOG_COMPONENTS
];

export const SUBJECTS_PROVIDERS = [
  SubjectsData
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
    StoreModule.forRoot(
      { filters: subjectsStateReducer },
      {
        initialState: {
          filters: INITIAL_FILTERS_STATE
        }
      }
    ),
		RouterModule.forChild([
			{
				path: 'subjects',
				component: SubjectsPageComponent,
				canActivate: [AuthGuard]
			}
		])
	],
	exports: [SUBJECTS_COMPONENTS],
	providers: [SUBJECTS_PROVIDERS]
})
export class SubjectsModule {}
