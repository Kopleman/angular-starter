import { Action } from '@ngrx/store';
import { CollectionActionTypes } from '../types';
import { ICustomAction, ModuleTypes } from '../../../shared/models/ngrx-action';

export class Paginate implements ICustomAction {
  public readonly type = CollectionActionTypes.PAGINATE;
  public readonly feature = ModuleTypes.TEMPLATES;
  constructor(public skip: number, public limit: number) {}
}
