import { Injectable } from '@angular/core';
import 'rxjs/add/operator/shareReplay';
import { Observable } from 'rxjs/Observable';

import { Api } from '../../core/services/api';
import {
	IUser,
	IUserFilters,
	IUserQueryParams,
	IUsersResponse
} from '../models/user';

@Injectable()
export class UsersData {
	constructor(private api: Api) {}

	public getUsers(skip: number, limit: number, filters?: IUserFilters) {
		return this.api.get<IUsersResponse, IUserQueryParams>('admin/rest/users', {
			skip,
			limit,
			...filters
		});
	}
}
