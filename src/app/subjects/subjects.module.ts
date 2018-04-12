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
import { subjectsStateReducer, SUBJECTS_INITIAL_FILTERS_STATE } from './store/reducer';
import { SubjectsListComponent } from './components/list/list.component';


const SUBJECTS_DIALOG_COMPONENTS = [];

export const SUBJECTS_COMPONENTS = [
	SubjectsPageComponent,
  SubjectsListComponent,
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
          filters: SUBJECTS_INITIAL_FILTERS_STATE
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
