import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgRedux, NgReduxModule } from '@angular-redux/store';

import { TemplatesData } from './services/templates-data';
import { SubjectsData } from './services/subjects-data';
import { TemplatesPageComponent } from './containers/templates.component';
import { TemplatesListComponent } from './components/list/list.component';
import { TemplateListItemComponent } from './components/list-item/list-item.component';
import { ColorThemesComponent } from './components/color-themes/color-themes.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';

import { AuthGuard } from '../auth/guards/auth';
import { CloneDialogComponent } from './components/clone-dialog/clone-dialog.component';
import { UsersData } from './services/users-data';
import { CreateDialogComponent } from './components/create-dialog/create-dialog.component';
import { PropertiesDialogComponent }
  from './components/properties-dialog/properties-dialog.component';
import { WhiteLabelsData } from './services/whitelabels-data';
import { SharedModule } from '../shared/shared.module';
import { FiltersActions } from './stores/filters.actions';
import { IFiltersState, INITIAL_STATE, rootReducer } from './stores/filters';

const DIALOG_COMPONENTS = [
	CloneDialogComponent,
	CreateDialogComponent,
	PropertiesDialogComponent
];

export const TEMPLATE_COMPONENTS = [
	TemplatesPageComponent,
	TemplatesListComponent,
	TemplateListItemComponent,
	TopBarComponent,
	ColorThemesComponent,
	...DIALOG_COMPONENTS
];

@NgModule({
	declarations: [TEMPLATE_COMPONENTS],
	imports: [
		CommonModule,
    NgReduxModule,
		FlexLayoutModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
    SharedModule,
		RouterModule.forChild([
			{
				path: 'templates',
				component: TemplatesPageComponent,
				canActivate: [AuthGuard]
			}
		])
	],
	entryComponents: DIALOG_COMPONENTS,
	exports: [TEMPLATE_COMPONENTS],
	providers: [TemplatesData, SubjectsData, UsersData, WhiteLabelsData, FiltersActions]
})
export class TemplatesModule {
  constructor(ngRedux: NgRedux<IFiltersState>) {
    ngRedux.configureStore(
      rootReducer,
      INITIAL_STATE);
  }
}
