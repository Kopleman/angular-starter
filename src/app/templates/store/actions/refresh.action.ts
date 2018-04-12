import { Action } from '@ngrx/store';
import { CollectionActionTypes } from '../types';

export class Refresh implements Action {
  public readonly type = CollectionActionTypes.REFRESH;
}
