import { Action } from '@ngrx/store';
import { SubjectsCollectionActionTypes } from '../types';

export class SubjectsPaginate implements Action {
  public readonly type = SubjectsCollectionActionTypes.PAGINATE;

  constructor(public skip: number, public limit: number) {}
}
