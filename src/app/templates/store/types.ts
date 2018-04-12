import { ApplyFilters } from './actions/apply-filters.action';
import { ResetFilters } from './actions/reset.action';
import { Paginate } from './actions/paginate.action';
import { Refresh } from './actions/refresh.action';

export enum CollectionActionTypes {
  APPLY_FILTERS = '[Collection] Apply Filters',
  RESET_FILTERS = '[Collection] ResetFilters',
  PAGINATE = '[Collection] Paginate',
  REFRESH = '[Collection] Refresh'
}

export type CollectionActionsUnion =
  | ApplyFilters
  | ResetFilters
  | Paginate
  | Refresh;
