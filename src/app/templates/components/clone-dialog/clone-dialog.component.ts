import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ICloneDialogData } from '../../models/dialog';
import { UsersData } from '../../services/users-data';
import { IUser } from '../../models/users';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'clone-dialog',
  templateUrl: './clone-dialog.component.html',
  styleUrls: ['./clone-dialog.component.scss'],
})
export class CloneDialogComponent implements OnInit{
  public users: IUser[];
  public cloneCreateForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<CloneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICloneDialogData,
    private formBuilder: FormBuilder,
    private userData: UsersData,) { }

  public ngOnInit() {
    this.userData.getUsersForCloneAction().subscribe((users) => {
      this.users = users;
    });

    this.cloneCreateForm = this.formBuilder.group({
      cloneName: [null, [Validators.required]],
      author: [null, Validators.required]
    });
  }

  public onCloseClick() {
    this.dialogRef.close();
  }

  public getHeaderName() {
    return  this.data.type === 'pageLess' ? 'Клонировать шаблон без страниц' : 'Клонировать шаблон';
  }

}