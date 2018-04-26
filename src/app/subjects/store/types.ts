import {
	SubjectsApplyFilters,
	SubjectsRefresh,
	SubjectsResetFilters,
	SubjectsPaginate
} from './actions';

export enum SubjectsCollectionActionTypes {
	APPLY_FILTERS = '[Subjects Collection] Apply Filters',
	RESET_FILTERS = '[Subjects Collection] ResetFilters',
	PAGINATE = '[Subjects Collection] Paginate',
	REFRESH = '[Subjects Collection] Refresh'
}

export type SubjectsCollectionActionsUnion =
	| SubjectsApplyFilters
	| SubjectsResetFilters
	| SubjectsPaginate
	| SubjectsRefresh;
