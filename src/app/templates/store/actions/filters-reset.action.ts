import { Action } from '@ngrx/store';
import { FiltersActionTypes } from './types';

export class Reset implements Action {
  public readonly type = FiltersActionTypes.RESET;
}
