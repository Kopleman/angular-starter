import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StoreModule } from '@ngrx/store';
import { NgxFileDropModule } from 'ngx-file-drop';

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
import { PropsDialogComponent } from './components/properties-dialog/props-dialog.component';
import { WhiteLabelsData } from '../shared/services/whitelabels-data';
import { SharedModule } from '../shared/shared.module';
import { reducer, INITIAL_FILTERS_STATE } from './store/reducer';
import { ModuleTypes } from '../shared/models/ngrx-action';
import { I18nDialogComponent } from './components/i18n-dialog/i18n-dialog.component';
import { StatusDialogComponent } from './components/status-dialog/status-dialog.component';
import { ChangePreviewsDialogComponent }
  from './components/change-previews-dialog/change-previews-dialog.component';


const DIALOG_COMPONENTS = [
	CloneDialogComponent,
	CreateDialogComponent,
	PropsDialogComponent,
	I18nDialogComponent,
  StatusDialogComponent,
  ChangePreviewsDialogComponent
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
		FlexLayoutModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
    NgxFileDropModule,
		StoreModule.forFeature(ModuleTypes.TEMPLATES, reducer, {
			initialState: INITIAL_FILTERS_STATE
		}),
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
	providers: [TemplatesData, SubjectsData, UsersData, WhiteLabelsData]
})
export class TemplatesModule {}
