import { Action } from '@ngrx/store';
import { CollectionActionTypes } from '../types';
import { ITemplateFilters } from '../../models/template';

export class ApplyFilters implements Action {
  public readonly type = CollectionActionTypes.APPLY_FILTERS;

  constructor(public filters: ITemplateFilters) {}
}
