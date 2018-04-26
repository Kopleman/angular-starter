import {
	UsersApplyFilters,
	UsersRefresh,
	UsersResetFilters,
	UsersPaginate
} from './actions';

export enum UsersCollectionActionTypes {
	APPLY_FILTERS = '[Users Collection] Apply Filters',
	RESET_FILTERS = '[Users Collection] ResetFilters',
	PAGINATE = '[Users Collection] Paginate',
	REFRESH = '[Users Collection] Refresh'
}

export type UsersCollectionActionsUnion =
	| UsersApplyFilters
	| UsersRefresh
	| UsersResetFilters
	| UsersPaginate;
