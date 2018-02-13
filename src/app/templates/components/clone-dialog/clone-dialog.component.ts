import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ICloneDialogData } from '../../models/dialog';
import { UsersData } from '../../services/users-data';
import { IUser } from '../../models/users';

@Component({
  selector: 'clone-dialog',
  templateUrl: './clone-dialog.component.html',
  styleUrls: ['./clone-dialog.component.scss'],
})
export class CloneDialogComponent implements OnInit{
  public users: IUser[];
  constructor(
    public dialogRef: MatDialogRef<CloneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICloneDialogData,
    private  userData: UsersData) { }

  public ngOnInit() {
    this.userData.getUsersForCloneAction().subscribe((users) => {
      this.users = users;
    })
  }

  public onCloseClick(): void {
    this.dialogRef.close();
  }

  public getHeaderName() {
    return  this.data.type === 'pageLess' ? 'Клонировать шаблон без страниц' : 'Клонировать шаблон';
  }

}
