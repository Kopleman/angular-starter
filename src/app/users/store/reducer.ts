import { IUserQueryParams } from '../models/user';
import {
	UsersCollectionActionsUnion,
	UsersCollectionActionTypes
} from './types';
import * as _ from 'lodash';

export const USERS_INITIAL_FILTERS_STATE: IUserQueryParams = {
	searchStr: '',
	sortBy: 'email',
	skip: 0,
	limit: 10
};

export function usersStateReducer(
	state: IUserQueryParams,
	action: UsersCollectionActionsUnion
) {
	switch (action.type) {
		case UsersCollectionActionTypes.PAGINATE: {
			state.skip = action.skip;
			state.limit = action.limit;
			return state;
		}

		case UsersCollectionActionTypes.APPLY_FILTERS: {
			state = _.merge(state, action.filters);
			state.skip = 0;
			return state;
		}

		case UsersCollectionActionTypes.RESET_FILTERS: {
			state.searchStr = USERS_INITIAL_FILTERS_STATE.searchStr;
			state.sortBy = USERS_INITIAL_FILTERS_STATE.sortBy;
			return state;
		}

		case UsersCollectionActionTypes.REFRESH:
		default: {
			return state;
		}
	}
}
