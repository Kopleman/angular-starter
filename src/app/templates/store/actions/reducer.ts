import { CollectionActionsUnion, CollectionActionTypes } from './types';
import { ITemplateQueryParams } from '../../models/template';

export const INITIAL_FILTERS_STATE: ITemplateQueryParams = {
	searchStr: '',
	selectedCategory: '',
	sortBy: '_id',
	skip: 0,
	limit: 10
};

export function reducer(
	state: ITemplateQueryParams,
	action: CollectionActionsUnion
) {
	switch (action.type) {
		case CollectionActionTypes.PAGINATE: {
			state.skip = action.skip;
			state.limit = action.limit;
			return state;
		}

		case CollectionActionTypes.APPLY_FILTERS: {
			state.selectedCategory = action.filters.selectedCategory;
			state.searchStr = action.filters.searchStr;
			state.sortBy = action.filters.sortBy;
			return state;
		}

		case CollectionActionTypes.RESET: {
			return INITIAL_FILTERS_STATE;
		}

		default: {
			return state;
		}
	}
}
