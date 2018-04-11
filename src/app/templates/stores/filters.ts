import { ITemplateFilters } from '../models/template';
import { FiltersAction, FiltersActions } from './filters.actions';

export interface IFiltersState extends ITemplateFilters{
}

export const INITIAL_STATE: IFiltersState = {
  searchStr: '',
  selectedCategory: '',
  sortBy: '_id'
};

export function rootReducer(lastState: IFiltersState, action: FiltersAction): IFiltersState {
  switch(action.type) {
    case FiltersActions.CHANGE: return action.filters;
    default: return lastState;
  }
}
