import { CollectionActionsUnion, CollectionActionTypes } from './types';
import { ITemplateQueryParams } from '../models/template';

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
			state.selectedCategory = action.filters.selectedCategory
				? action.filters.selectedCategory
				: state.selectedCategory;
			state.searchStr = action.filters.searchStr
				? action.filters.searchStr
				: state.searchStr;
			state.sortBy = action.filters.sortBy
				? action.filters.sortBy
				: state.sortBy;
			state.skip = 0;
			return state;
		}

		case CollectionActionTypes.RESET_FILTERS: {
			state.selectedCategory = INITIAL_FILTERS_STATE.selectedCategory;
			state.searchStr = INITIAL_FILTERS_STATE.searchStr;
			state.sortBy = INITIAL_FILTERS_STATE.sortBy;
			return state;
		}

    case CollectionActionTypes.REFRESH:
		default: {
			return state;
		}
	}
}
