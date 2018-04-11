import { Injectable } from '@angular/core';
import { Action } from 'redux';
import { ITemplateFilters } from '../models/template';

export interface FiltersAction extends Action{
  filters: ITemplateFilters
}

@Injectable()
export class FiltersActions {
  public static CHANGE = 'CHANGE';
  public change(filters: ITemplateFilters): FiltersAction {
    return { type: FiltersActions.CHANGE, filters }
  }
}
