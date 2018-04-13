import { SubjectsCollectionActionTypes } from '../types';
import { ISubjectFilters } from '../../models/subject';
import { CustomAction, ModuleTypes } from '../../../shared/models/ngrx-action';

export class SubjectsApplyFilters implements CustomAction {
  public readonly type = SubjectsCollectionActionTypes.APPLY_FILTERS;
  public readonly module = ModuleTypes.SUBJECTS;
  constructor(public filters: ISubjectFilters) {}
}
