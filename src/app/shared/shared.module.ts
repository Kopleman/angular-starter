import { NgModule } from '@angular/core';
import { MomentDate } from './pipes/moment-date';
import { CommonModule } from '@angular/common';
@NgModule({
	imports: [CommonModule],
	declarations: [MomentDate],
	exports: [MomentDate]
})
export class SharedModule {}
