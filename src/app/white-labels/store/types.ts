import {
	WhiteLabelsApplyFilters,
	WhiteLabelsRefresh,
	WhiteLabelsResetFilters,
	WhiteLabelsPaginate
} from './actions';

export enum WhiteLabelsCollectionActionTypes {
	APPLY_FILTERS = '[WhiteLabels Collection] Apply Filters',
	RESET_FILTERS = '[WhiteLabels Collection] ResetFilters',
	PAGINATE = '[WhiteLabels Collection] Paginate',
	REFRESH = '[WhiteLabels Collection] Refresh'
}

export type WhiteLabelsCollectionActionsUnion =
	| WhiteLabelsApplyFilters
	| WhiteLabelsRefresh
	| WhiteLabelsResetFilters
	| WhiteLabelsPaginate;
