import { ApplyFilters, Paginate, Refresh, ResetFilters } from './actions';

export enum SubjectsCollectionActionTypes {
  APPLY_FILTERS = '[Collection] Apply Filters',
  RESET_FILTERS = '[Collection] ResetFilters',
  PAGINATE = '[Collection] Paginate',
  REFRESH = '[Collection] Refresh'
}

export type SubjectsCollectionActionsUnion =
  | ApplyFilters
  | ResetFilters
  | Paginate
  | Refresh;
