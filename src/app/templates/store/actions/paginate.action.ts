import { Action } from '@ngrx/store';
import { CollectionActionTypes } from '../types';

export class Paginate implements Action {
  public readonly type = CollectionActionTypes.PAGINATE;

  constructor(public skip: number, public limit: number) {}
}
