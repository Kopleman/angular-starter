import { Action } from '@ngrx/store';
import { SubjectsCollectionActionTypes } from '../types';

export class ResetFilters implements Action {
  public readonly type = SubjectsCollectionActionTypes.RESET_FILTERS;
}
