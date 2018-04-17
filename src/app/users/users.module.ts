import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StoreModule } from '@ngrx/store';

import { AuthGuard } from '../auth/guards/auth';
import { SharedModule } from '../shared/shared.module';
import { USERS_INITIAL_FILTERS_STATE, usersStateReducer } from './store/reducer';
import { UsersPageComponent } from './containers/users.component';


const USERS_DIALOG_COMPONENTS = [];

const USERS_COMPONENTS = [
  UsersPageComponent,
  ...USERS_DIALOG_COMPONENTS
];

const USERS_PROVIDERS = [];

@NgModule({
  declarations: [USERS_COMPONENTS],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    StoreModule.forFeature(
      'users',
      usersStateReducer,
      {
        initialState: USERS_INITIAL_FILTERS_STATE
      }
    ),
    RouterModule.forChild([
      {
        path: 'users',
        component: UsersPageComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  entryComponents: USERS_DIALOG_COMPONENTS,
  exports: [USERS_COMPONENTS],
  providers: [USERS_PROVIDERS],
})
export class UsersModule {}
