import { NgModule } from '@angular/core';
import { MomentDate } from './pipes/moment-date';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MaterialModule } from '../material';
@NgModule({
	imports: [CommonModule, MaterialModule],
	declarations: [MomentDate, ConfirmDialogComponent],
	entryComponents: [ConfirmDialogComponent],
	exports: [MomentDate, ConfirmDialogComponent]
})
export class SharedModule {}
