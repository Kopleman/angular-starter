import { ISubjectQueryParams } from '../models/subject';
import { SubjectsCollectionActionTypes } from './types';
import { SubjectsCollectionActionsUnion } from './types';
import * as _ from 'lodash';

export const SUBJECTS_INITIAL_FILTERS_STATE: ISubjectQueryParams = {
  searchStr: '',
  sortBy: '_id',
  skip: 0,
  limit: 10
};

export function subjectsStateReducer(
  state: ISubjectQueryParams,
  action: SubjectsCollectionActionsUnion
) {
  switch (action.type) {
    case SubjectsCollectionActionTypes.PAGINATE: {
      state.skip = action.skip;
      state.limit = action.limit;
      return state;
    }

    case SubjectsCollectionActionTypes.APPLY_FILTERS: {
      state = _.merge(state, action.filters);
      state.skip = 0;
      return state;
    }

    case SubjectsCollectionActionTypes.RESET_FILTERS: {
      state.searchStr = SUBJECTS_INITIAL_FILTERS_STATE.searchStr;
      state.sortBy = SUBJECTS_INITIAL_FILTERS_STATE.sortBy;
      return state;
    }

    case SubjectsCollectionActionTypes.REFRESH:
    default: {
      return state;
    }
  }
}
