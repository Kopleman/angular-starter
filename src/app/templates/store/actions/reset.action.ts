import { Action } from '@ngrx/store';
import { CollectionActionTypes } from '../types';

export class ResetFilters implements Action {
  public readonly type = CollectionActionTypes.RESET_FILTERS;
}
