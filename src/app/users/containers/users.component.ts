import { Component, OnInit } from '@angular/core';
import { ActionsSubject, select, Store } from '@ngrx/store';
import { INewUser, IUser, IUserQueryParams } from '../models/user';
import { UsersData } from '../services/users-data';
import { Collection } from '../../shared/abstracts/collection';
import { ICustomAction, ModuleTypes } from '../../shared/models/ngrx-action';
import { ISubjectFilters } from '../../subjects/models/subject';
import { MatDialog, MatSnackBar, PageEvent } from '@angular/material';
import { UsersApplyFilters, UsersPaginate } from '../store/actions';
import { ICreateUserDialogData } from '../models/dialog';
import { CreateUserDialogComponent } from '../components/create-dialog/create-dialog.component';
import { of } from 'rxjs/observable/of';

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
		this.filters$
			.share()
			.take(1)
			.subscribe(state => {
				this.pageIndex = state.skip / state.limit;
				this.pageSize = state.limit;
				this.getUsers(state);
			})
			.unsubscribe();

		this.actionSubjectSubscription = this.actionSubject
			.skip(1)
			.filter((action: ICustomAction) => this.actionFilter(action))
			.subscribe(() => {
				this.filters$
					.take(1)
					.subscribe(state => {
						this.getUsers(state);
					})
					.unsubscribe();
			});
	}

	public paginate($event: PageEvent) {
		this.pageIndex = $event.pageIndex;
		this.pageSize = $event.pageSize;
		let skip = this.pageIndex * this.pageSize;
		this.store.dispatch(new UsersPaginate(skip, this.pageSize));
	}

	public createNewUser() {
		let dialogResult: ICreateUserDialogData;
		let dialogRef = this.dialog.open<
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
			.flatMap(result => {
			  console.log(result);
				if (!result) {
					return of(null);
				}
				dialogResult = result;
				let newUser: INewUser = {
				  email: result.email,
          phone: result.phone,
          password: result.password,
          firstName: result.firstName,
          lastName: result.lastName,
          role: result.role
        };
        this.snackBar.open(`Создаем нового пользователя`, 'Закрыть');
				return this.usersData.createNewUser(newUser);
			})
			.subscribe(
				result => {
					if( result ){
            this.snackBar.open(`Пользователь создан`, 'Закрыть', {
              duration: 2000
            });
            this.store.dispatch(new UsersApplyFilters({searchStr: dialogResult.email}));
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
		return action.feature === ModuleTypes.USERS;
	}

	private getUsers(state) {
		this.inProgress = true;
		let filters: ISubjectFilters = {
			searchStr: state.searchStr,
			sortBy: state.sortBy
		};

		this.usersData
			.getUsers(state.skip, state.limit, filters)
			.shareReplay()
			.subscribe(response => {
				this.inProgress = false;
				this.total = response.count;
				this.collection = response.users;
			});
	}
}
