import { CollectionActionsUnion, CollectionActionTypes } from './types';
import { ITemplateQueryParams } from '../models/template';
import * as _ from 'lodash';

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
			state = _.merge(state, action.filters);
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
