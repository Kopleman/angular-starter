import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TemplatesData } from './services/templates-data';
import { SubjectsData } from './services/subjects-data';
import { TemplatesPageComponent } from './containers/templates.component';
import { TemplatesListComponent } from './components/list/list.component';
import { TemplateListItemComponent } from './components/list-item/list-item.component';
import { ColorThemesComponent } from './components/color-themes/color-themes.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';

import { MomentDate } from '../shared/pipes/moment-date';
import { AuthGuard } from '../auth/guards/auth';
import { CloneDialogComponent } from './components/clone-dialog/clone-dialog.component';
import { UsersData } from './services/users-data';
import { CreateDialogComponent } from './components/create-dialog/create-dialog.component';

export const TEMPLATE_COMPONENTS = [
  TemplatesPageComponent,
  TemplatesListComponent,
  TemplateListItemComponent,
  TopBarComponent,
  ColorThemesComponent,
  CloneDialogComponent,
  CreateDialogComponent
];

@NgModule({
  declarations: [
    TEMPLATE_COMPONENTS,
    MomentDate,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild([
      { path: 'templates', component: TemplatesPageComponent, canActivate: [ AuthGuard ] }
    ])
  ],
  entryComponents: [CloneDialogComponent, CreateDialogComponent],
  exports: [
    TEMPLATE_COMPONENTS
  ],
  providers: [
    TemplatesData,
    SubjectsData,
    UsersData
  ],
})
export class TemplatesModule {}
