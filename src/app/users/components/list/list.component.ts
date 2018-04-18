import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { IUser } from '../../models/user';
import { UsersData } from '../../services/users-data';

@Component({
  selector: 'users-list',
  styleUrls: ['./list.component.scss'],
  templateUrl: './list.component.html'
})
export class UsersListComponent implements OnInit{
  @Input() public users: IUser[];
  public displayedColumns = [];

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private usersData: UsersData
  ) {}

  public ngOnInit() {
    this.displayedColumns = ['firstName', 'email', 'created', 'role','controls'];
  }

  public createDataSource(users: IUser[]) {
    return new MatTableDataSource(users);
  }
}
