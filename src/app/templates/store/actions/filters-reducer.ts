import { FiltersActionsUnion, FiltersActionTypes } from './types';
import { State } from '@ngrx/store';
import { ITemplateFilters } from '../../models/template';


export function filtersReducer(state: number = 0, action: FiltersActionsUnion) {
  switch(action.type) {
    case FiltersActionTypes.CHANGE: {
      return action.payload;
    }


    case FiltersActionTypes.RESET: {
      return {
        searchStr: '',
        selectedCategory: '',
        sortBy: '_id'
      };
    }

    default: {
      return state;
    }
  }
}
