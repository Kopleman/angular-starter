import { ApplyFilters, ResetFilters, Paginate, Refresh } from './actions';

export enum CollectionActionTypes {
	APPLY_FILTERS = '[Collection] Apply Filters',
	RESET_FILTERS = '[Collection] ResetFilters',
	PAGINATE = '[Collection] Paginate',
	REFRESH = '[Collection] Refresh'
}

export type CollectionActionsUnion =
	| ApplyFilters
	| ResetFilters
	| Paginate
	| Refresh;
