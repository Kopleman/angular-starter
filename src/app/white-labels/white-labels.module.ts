import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StoreModule } from '@ngrx/store';

import { AuthGuard } from '../auth/guards/auth';
import { SharedModule } from '../shared/shared.module';
import {
	whiteLabelsStateReducer,
	WHITELABLES_INITIAL_FILTERS_STATE
} from './store/reducer';
import { ModuleTypes } from '../shared/models/ngrx-action';
import { WhiteLabelsPageComponent } from './containers/white-labels.component';
import { WhiteLabelsData } from './services/white-labels-data';
import { WhiteLabelsListComponent } from './components/list/list.component';
import { WhiteLabelTopBarComponent } from './components/top-bar/top-bar.component';
import { CreateWhiteLabelDialogComponent }
	from './components/create-dialog/create-dialog.component';
import { EditWhiteLabelDialogComponent } from './components/edit-dialog/edit-dialog.component';
import { WhiteLabelsGuard } from './guards/can-activate';

const WHITELABELS_DIALOG_COMPONENTS = [
	CreateWhiteLabelDialogComponent,
	EditWhiteLabelDialogComponent
];

const WHITELABELS_COMPONENTS = [
	WhiteLabelsPageComponent,
	WhiteLabelsListComponent,
	WhiteLabelTopBarComponent,
	...WHITELABELS_DIALOG_COMPONENTS
];

const WHITELABELS_PROVIDERS = [WhiteLabelsData, WhiteLabelsGuard];

@NgModule({
	declarations: [WHITELABELS_COMPONENTS],
	imports: [
		CommonModule,
		FlexLayoutModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		SharedModule,
		StoreModule.forFeature(ModuleTypes.WHITELABELS, whiteLabelsStateReducer, {
			initialState: WHITELABLES_INITIAL_FILTERS_STATE
		}),
		RouterModule.forChild([
			{
				path: 'whiteLabels',
				component: WhiteLabelsPageComponent,
				canActivate: [AuthGuard, WhiteLabelsGuard]
			}
		])
	],
	entryComponents: WHITELABELS_DIALOG_COMPONENTS,
	exports: [WHITELABELS_COMPONENTS],
	providers: [WHITELABELS_PROVIDERS]
})
export class WhiteLabelsModule {}
