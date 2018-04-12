import {
	SubjectsApplyFilters,
	SubjectsRefresh,
	SubjectsResetFilters,
  SubjectsPaginate
} from './actions';

export enum SubjectsCollectionActionTypes {
	APPLY_FILTERS = '[Collection] Apply Filters',
	RESET_FILTERS = '[Collection] ResetFilters',
	PAGINATE = '[Collection] Paginate',
	REFRESH = '[Collection] Refresh'
}

export type SubjectsCollectionActionsUnion =
	| SubjectsApplyFilters
	| SubjectsResetFilters
	| SubjectsPaginate
	| SubjectsRefresh;
