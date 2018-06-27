import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Api } from '../../core/services/api';
import { IUser } from '../models/users';

@Injectable()
export class UsersData {
	public usersForCloneAction$: Observable<IUser[]>;
	constructor(private api: Api) {}

	public getUsersForCloneAction() {
		if (!this.usersForCloneAction$) {
			this.usersForCloneAction$ = this._getUsersForCloneAction();
		}
		return this.usersForCloneAction$;
	}

	private _getUsersForCloneAction() {
		return this.api
			.get<IUser[], null>('admin/rest/userList/cloneTemplate')
			.pipe( shareReplay() );
	}
}
