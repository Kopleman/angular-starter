import { ISubjectQueryParams } from '../models/subject';
import { SubjectsCollectionActionTypes } from './types';
import { SubjectsCollectionActionsUnion } from './types';


export const INITIAL_FILTERS_STATE: ISubjectQueryParams = {
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
      state.searchStr = action.filters.searchStr
        ? action.filters.searchStr
        : state.searchStr;
      state.sortBy = action.filters.sortBy
        ? action.filters.sortBy
        : state.sortBy;
      state.skip = 0;
      return state;
    }

    case SubjectsCollectionActionTypes.RESET_FILTERS: {
      state.searchStr = INITIAL_FILTERS_STATE.searchStr;
      state.sortBy = INITIAL_FILTERS_STATE.sortBy;
      return state;
    }

    case SubjectsCollectionActionTypes.REFRESH:
    default: {
      return state;
    }
  }
}
