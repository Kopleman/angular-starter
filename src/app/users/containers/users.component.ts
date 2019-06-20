import { Component, OnInit } from '@angular/core';
import { ActionsSubject, select, Store, UPDATE } from '@ngrx/store';
import { of } from 'rxjs';
import { filter, flatMap } from 'rxjs/operators';
import {
  INewUser,
  IUser,
  IUserFilters,
  IUserQueryParams, IUsersResponse
} from '../models/user';
import { UsersData } from '../services/users-data';
import { Collection } from '../../shared/abstracts/collection';
import { ICustomAction, ModuleTypes } from '../../shared/models/ngrx-action';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersApplyFilters, UsersPaginate } from '../store/actions';
import { ICreateUserDialogData } from '../models/dialog';
import { CreateUserDialogComponent } from '../components/create-dialog/create-dialog.component';

@Component({
	selector: 'users-page',
	styleUrls: ['./users.component.scss'],
	templateUrl: './users.component.html'
})
export class UsersPageComponent extends Collection<IUser[], IUserQueryParams>
	implements OnInit {
	constructor(
		private usersData: UsersData,
		private actionSubject: ActionsSubject,
		private store: Store<IUserQueryParams>,
		private snackBar: MatSnackBar,
		public dialog: MatDialog
	) {
		super();
	}

	public ngOnInit() {
		this.filters$ = this.store.pipe(select(ModuleTypes.USERS));
		this.getUsers();
		this.actionSubjectSubscription = this.actionSubject
			.pipe( filter((action: ICustomAction) => this.actionFilter(action)) )
			.subscribe(() => {
				this.getUsers();
			});
	}

	public paginate($event: PageEvent) {
		this.pageIndex = $event.pageIndex;
		this.pageSize = $event.pageSize;
		const skip = this.pageIndex * this.pageSize;
		this.store.dispatch(new UsersPaginate(skip, this.pageSize));
	}

	public createNewUser() {
		let dialogResult: ICreateUserDialogData;
    const dialogRef = this.dialog.open<
			CreateUserDialogComponent,
			ICreateUserDialogData
		>(CreateUserDialogComponent, {
			width: '580px',
			closeOnNavigation: true,
			panelClass: 'create-user-dialog-component',
			data: {
				rolesList$: this.usersData.getRolesList(),
				password: '',
				email: '',
				firstName: '',
				lastName: '',
				role: 'guest',
				phone: ''
			}
		});

		dialogRef
			.afterClosed()
			.pipe( flatMap(result => {
				if (!result) {
					return of(null);
				}
				dialogResult = result;
        const newUser: INewUser = {
					email: result.email,
					phone: result.phone,
					password: result.password,
					firstName: result.firstName,
					lastName: result.lastName,
					role: result.role
				};
				this.snackBar.open(`Создаем нового пользователя`, 'Закрыть');
				return this.usersData.createNewUser(newUser);
			}))
			.subscribe(
				result => {
					if (result) {
						this.snackBar.open(`Пользователь создан`, 'Закрыть', {
							duration: 2000
						});
						this.store.dispatch(
							new UsersApplyFilters({ searchStr: dialogResult.email })
						);
					}
				},
				errorResp => {
					console.log(errorResp);
					this.snackBar.open(
						`Ошибки при создании: ${errorResp.error.message}`,
						'Закрыть'
					);
				}
			);
	}

	protected actionFilter(action) {
		return (
			action.feature === ModuleTypes.USERS &&
			action.type !== UPDATE
		);
	}

	private getUsers() {
		this.inProgress = true;
		this.filters$
			.pipe( flatMap(state => {
				this.pageIndex = state.skip / state.limit;
				this.pageSize = state.limit;
        const filters: IUserFilters = {
					searchStr: state.searchStr,
					sortBy: state.sortBy
				};
				return this.usersData.getUsers(state.skip, state.limit, filters);
			}) )
			.subscribe((response: IUsersResponse) => {
				this.inProgress = false;
				this.total = response.count;
				this.collection = response.users;
			});
	}
}
