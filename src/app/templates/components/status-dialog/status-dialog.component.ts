import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PropsDialogComponent } from '../properties-dialog/props-dialog.component';
import { ITemplate } from '../../models/template';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'status-edit-dialog',
  templateUrl: './status-dialog.component.html',
  styleUrls: ['./status-dialog.component.scss']
})
export class StatusDialogComponent implements OnInit{
  public editForm: FormGroup;
  public statuses = [
    { value: 'complete', title: 'Опубликован' },
    { value: 'inProcess', title: 'Не опубликован' },
  ];
  constructor(
    public dialogRef: MatDialogRef<PropsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ITemplate,
    private formBuilder: FormBuilder
  ){}

  public ngOnInit() {
    const controls = {
      status: [this.data.status, Validators.required]
    };
    this.editForm = this.formBuilder.group(controls);
    this.editForm.valueChanges
      .pipe(filter(() => this.editForm.valid))
      .subscribe((value) => {
        this.data = {...this.data, ...value};
      });
  }

  public onCloseClick() {
    this.dialogRef.close();
  }
}
