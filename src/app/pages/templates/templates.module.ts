import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesPageComponent } from './templates.component';
import { TemplatesListComponent } from './list/list.component';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule, MatIconModule, MatListModule,
  MatMenuModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MomentDate } from '../../pipes/moment-date';


@NgModule({
  declarations: [
    TemplatesPageComponent,
    TemplatesListComponent,
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
    TemplatesListComponent
  ]
})
export class TemplatesModule {}
