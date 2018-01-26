import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatIconModule, MatListModule,
  MatMenuModule
} from '@angular/material';
import { TemplatesPageComponent } from './templates.component';
import { TemplatesListComponent } from './list/list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MomentDate } from '../../pipes/moment-date';
import { TemplateListItemComponent } from './list-item/list-item.component';
import { ColorThemesComponent } from './color-themes/color-themes.component';


@NgModule({
  declarations: [
    TemplatesPageComponent,
    TemplatesListComponent,
    TemplateListItemComponent,
    ColorThemesComponent,
    MomentDate
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatMenuModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  exports: [
    TemplatesPageComponent,
    TemplatesListComponent,
    TemplateListItemComponent,
    ColorThemesComponent
  ]
})
export class TemplatesModule {}
