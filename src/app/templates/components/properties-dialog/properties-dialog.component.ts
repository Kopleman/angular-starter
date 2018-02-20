import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IChangePropsDialogData, ICloneDialogData } from '../../models/dialog';
import { UsersData } from '../../services/users-data';
import { IUser } from '../../models/users';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITemplate } from '../../models/template';

@Component({
  selector: 'properties-dialog',
  templateUrl: './properties-dialog.component.html',
})
export class PropertiesDialogComponent implements OnInit{
  public propertiesForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<PropertiesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IChangePropsDialogData,
    private formBuilder: FormBuilder) { }

  public ngOnInit() {
    console.log(this.data);
    this.propertiesForm = this.formBuilder.group({
      selectedSubject: [null, Validators.required],
    });
  }

  public onCloseClick() {
    this.dialogRef.close();
  }

  public getTempalateLangs() {
    return Object.keys(this.data.template.i18nTitles);
  }
}
