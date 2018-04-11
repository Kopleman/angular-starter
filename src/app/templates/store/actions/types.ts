import { ApplyFilters } from './apply-filters.action';
import { Reset } from './reset.action';
import { Paginate } from './paginate.action';

export enum CollectionActionTypes {
  APPLY_FILTERS = '[Collection] Apply Filters',
  PAGINATE = '[Collection] Paginate',
  RESET = '[Collection] Reset',
}

export type CollectionActionsUnion =
  | ApplyFilters
  | Paginate
  | Reset;
