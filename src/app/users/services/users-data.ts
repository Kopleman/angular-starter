import { Injectable } from '@angular/core';
import 'rxjs/add/operator/shareReplay';
import { Observable } from 'rxjs/Observable';

import { Api } from '../../core/services/api';
import {
	INewUser,
	IUser,
	IUserFilters,
	IUserQueryParams,
	IUserRole,
	IUsersResponse
} from '../models/user';

@Injectable()
export class UsersData {
	private userRoles: Observable<IUserRole[]>;
	constructor(private api: Api) {}

	public getUsers(skip: number, limit: number, filters?: IUserFilters) {
		return this.api.get<IUsersResponse, IUserQueryParams>('admin/rest/users', {
			skip,
			limit,
			...filters
		});
	}

	public createNewUser(user: INewUser) {
		return this.api.post('admin/rest/users', user);
	}

  public editUser(user: IUser) {
    return this.api.put(`admin/rest/users`, user);
  }

	public removeUser(user: IUser) {
		return this.api.delete(`admin/rest/users/${user._id}`);
	}

	public getRolesList() {
		if (!this.userRoles) {
			this.userRoles = this._getRolesList().shareReplay(1);
		}

		return this.userRoles;
	}

	private _getRolesList() {
		return this.api.get<IUserRole[], null>('admin/rest/users/roles');
	}
}
