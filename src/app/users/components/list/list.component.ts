import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import {
	INewUser,
	IUser,
	IUserQueryParams,
	IUserRole
} from '../../models/user';
import { UsersData } from '../../services/users-data';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { ICreateUserDialogData } from '../../models/dialog';
import { IConfirmDialogData } from '../../../shared/models/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { of } from 'rxjs/observable/of';
import { UsersApplyFilters, UsersRefresh } from '../../store/actions';
import { Store } from '@ngrx/store';

@Component({
	selector: 'users-list',
	styleUrls: ['./list.component.scss'],
	templateUrl: './list.component.html'
})
export class UsersListComponent implements OnInit {
	@Input() public users: IUser[];
	public displayedColumns = [];
	constructor(
		public dialog: MatDialog,
		private snackBar: MatSnackBar,
		private usersData: UsersData,
		private store: Store<IUserQueryParams>
	) {}

	public ngOnInit() {
		this.displayedColumns = [
			'firstName',
			'email',
			'created',
			'role',
			'controls'
		];
	}

	public createDataSource(users: IUser[]) {
		return new MatTableDataSource(users);
	}

	public translateUserRole(role: string) {
		return this.usersData.getRolesList().pipe(
			map(list => {
				let founded = _.find(list, r => r.value === role);
				return founded ? founded.name : role;
			})
		);
	}

	public deleteUser(user: IUser) {
		this.dialog
			.open<ConfirmDialogComponent, IConfirmDialogData>(
				ConfirmDialogComponent,
				{
					width: '580px',
					closeOnNavigation: true,
					panelClass: 'confirm-dialog-component',
					data: {
						header: 'Удалеоение пользователя',
						text: `Вы точно хотите удалить пользователя ${user.firstName} ${
							user.lastName
						}?`
					}
				}
			)
			.afterClosed()
			.flatMap(result => {
				if (!result) {
					return of(null);
				}

				this.snackBar.open(`Удаляем пользователя`, 'Закрыть');
				return this.usersData.removeUser(user);
			})
			.subscribe(
				result => {
					if (result) {
						this.snackBar.open(`Пользователь удален`, 'Закрыть', {
							duration: 2000
						});
						this.store.dispatch(new UsersRefresh());
					}
				},
				errorResp => {
					console.log(errorResp);
					this.snackBar.open(
						`Ошибки при удалении: ${errorResp.error.message}`,
						'Закрыть'
					);
				}
			);
	}
}
