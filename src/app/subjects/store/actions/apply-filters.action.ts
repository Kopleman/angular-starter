import { Action } from '@ngrx/store';
import { SubjectsCollectionActionTypes } from '../types';
import { ISubjectFilters } from '../../models/subject';

export class SubjectsApplyFilters implements Action {
  public readonly type = SubjectsCollectionActionTypes.APPLY_FILTERS;

  constructor(public filters: ISubjectFilters) {}
}
