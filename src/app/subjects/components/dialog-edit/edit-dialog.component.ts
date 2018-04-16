import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WhiteLabelsData } from '../../../shared/services/whitelabels-data';
import { IWhiteLabel } from '../../../shared/models/whitelabel';

@Component({
  selector: 'subject-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss'],
})
export class SubjectEditDialogComponent implements OnInit{
  public editForm: FormGroup;
  public whiteLabels: IWhiteLabel[];
  constructor(
    public dialogRef: MatDialogRef<SubjectEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any[],
    private formBuilder: FormBuilder,
    private whiteLabelsData: WhiteLabelsData) { }

  public ngOnInit() {
    let controls = {
      selectedWhiteLabel: [null, null],
    };
    this.editForm = this.formBuilder.group(controls);
    this.whiteLabelsData.getWhiteLabels().subscribe((wls) => {
      this.whiteLabels = wls;
    });
  }

  public onCloseClick() {
    this.dialogRef.close();
  }
}
