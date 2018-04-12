import { Action } from '@ngrx/store';
import { SubjectsCollectionActionTypes } from '../types';

export class SubjectsResetFilters implements Action {
  public readonly type = SubjectsCollectionActionTypes.RESET_FILTERS;
}
