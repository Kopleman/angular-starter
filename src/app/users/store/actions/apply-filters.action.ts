import { UsersCollectionActionTypes } from '../types';
import { ICustomAction, ModuleTypes } from '../../../shared/models/ngrx-action';
import { IUserFilters } from '../../models/user';

export class UsersApplyFilters implements ICustomAction {
	public readonly type = UsersCollectionActionTypes.APPLY_FILTERS;
	public readonly feature = ModuleTypes.USERS;
	constructor(public filters: IUserFilters) {}
}
