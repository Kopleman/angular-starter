import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatIconModule, MatInputModule, MatListModule,
  MatMenuModule, MatPaginatorModule, MatProgressSpinnerModule,
  MatSelectModule
} from '@angular/material';
import { TemplatesPageComponent } from './templates.component';
import { TemplatesListComponent } from './list/list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MomentDate } from '../../pipes/moment-date';
import { TemplateListItemComponent } from './list-item/list-item.component';
import { ColorThemesComponent } from './color-themes/color-themes.component';
import { TopBarComponent } from './top-bar/top-bar.component';


@NgModule({
  declarations: [
    TemplatesPageComponent,
    TemplatesListComponent,
    TemplateListItemComponent,
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
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSelectModule
  ],
  exports: [
    TemplatesPageComponent,
    TemplatesListComponent,
    TemplateListItemComponent,
    TopBarComponent,
    ColorThemesComponent
  ]
})
export class TemplatesModule {}
