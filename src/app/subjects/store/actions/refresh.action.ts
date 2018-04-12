import { Action } from '@ngrx/store';
import { SubjectsCollectionActionTypes } from '../types';

export class SubjectsRefresh implements Action {
  public readonly type = SubjectsCollectionActionTypes.REFRESH;
}
