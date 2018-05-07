import { IWhiteLabelQueryParams } from '../model/white-label';
import {
	WhiteLabelsCollectionActionsUnion,
	WhiteLabelsCollectionActionTypes
} from './types';
import * as _ from 'lodash';

export const WHITELABLES_INITIAL_FILTERS_STATE: IWhiteLabelQueryParams = {
	searchStr: '',
	sortBy: 'email',
	skip: 0,
	limit: 10
};

export function whiteLabelsStateReducer(
	state: IWhiteLabelQueryParams,
	action: WhiteLabelsCollectionActionsUnion
) {
	switch (action.type) {
		case WhiteLabelsCollectionActionTypes.PAGINATE: {
			state.skip = action.skip;
			state.limit = action.limit;
			return state;
		}

		case WhiteLabelsCollectionActionTypes.APPLY_FILTERS: {
			state = _.merge(state, action.filters);
			state.skip = 0;
			return state;
		}

		case WhiteLabelsCollectionActionTypes.RESET_FILTERS: {
			state.searchStr = WHITELABLES_INITIAL_FILTERS_STATE.searchStr;
			state.sortBy = WHITELABLES_INITIAL_FILTERS_STATE.sortBy;
			return state;
		}

		case WhiteLabelsCollectionActionTypes.REFRESH:
		default: {
			return state;
		}
	}
}
