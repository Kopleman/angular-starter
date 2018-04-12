import { Action } from '@ngrx/store';
import { SubjectsCollectionActionTypes } from '../types';

export class Refresh implements Action {
  public readonly type = SubjectsCollectionActionTypes.REFRESH;
}
