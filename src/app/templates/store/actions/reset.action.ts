import { Action } from '@ngrx/store';
import { CollectionActionTypes } from './types';

export class Reset implements Action {
  public readonly type = CollectionActionTypes.RESET;
}
