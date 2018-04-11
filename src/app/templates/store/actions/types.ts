import { ApplyFilters } from './apply-filters.action';
import { ResetFilters } from './reset.action';
import { Paginate } from './paginate.action';

export enum CollectionActionTypes {
  APPLY_FILTERS = '[Collection] Apply Filters',
  RESET_FILTERS = '[Collection] ResetFilters',
  PAGINATE = '[Collection] Paginate',
}

export type CollectionActionsUnion =
  | ApplyFilters
  | Paginate
  | ResetFilters;
