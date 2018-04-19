import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { IUser, IUserRole } from '../../models/user';
import { UsersData } from '../../services/users-data';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

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

  public translateUserRole(role: string) {
    return this.usersData.getRolesList().pipe(map((list => {
      let founded = _.find(list, (r) => r.value === role);
      return founded ? founded.name : role;
    })));
  }
}
