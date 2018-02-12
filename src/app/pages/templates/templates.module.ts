import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule, MatIconModule, MatInputModule,
  MatMenuModule, MatPaginatorModule, MatProgressSpinnerModule,
  MatSelectModule, MatSlideToggleModule, MatSnackBarModule
} from '@angular/material';
import { TemplatesData } from '../../providers/templates-data';
import { SubjectsData } from '../../providers/subjects-data';
import { TemplatesPageComponent } from './templates.component';
import { TemplatesListComponent } from './list/list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MomentDate } from '../../pipes/moment-date';
import { TemplateListItemComponent } from './list-item/list-item.component';
import { ColorThemesComponent } from './list-item/color-themes/color-themes.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { ListItemControlsComponent } from './list-item/controls/controls.component';

@NgModule({
  declarations: [
    TemplatesPageComponent,
    TemplatesListComponent,
    TemplateListItemComponent,
    ListItemControlsComponent,
    TopBarComponent,
    ColorThemesComponent,
    MomentDate
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule
  ],
  exports: [
    TemplatesPageComponent,
    TemplatesListComponent,
    TemplateListItemComponent,
    TopBarComponent,
    ColorThemesComponent
  ],
  providers: [
    TemplatesData,
    SubjectsData
  ]
})
export class TemplatesModule {}
