import { Action } from '@ngrx/store';
import { FiltersActionTypes } from './types';
import { ITemplateFilters } from '../../models/template';

export class Change implements Action {
  public readonly type = FiltersActionTypes.CHANGE;

  constructor(public payload: ITemplateFilters) {}
}
