import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ICloneDialogData } from '../../models/dialog';

@Component({
  selector: 'clone-dialog',
  templateUrl: './clone-dialog.component.html',
})
export class CloneDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CloneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICloneDialogData) { }

  public onCloseClick(): void {
    this.dialogRef.close();
  }

  public getHeaderName() {
    return  this.data.type === 'pageLess' ? 'Create a pageless clone' : 'Create a clone';
  }

}
