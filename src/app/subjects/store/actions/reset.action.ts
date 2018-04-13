import { SubjectsCollectionActionTypes } from '../types';
import { CustomAction, ModuleTypes } from '../../../shared/models/ngrx-action';

export class SubjectsResetFilters implements CustomAction {
  public readonly type = SubjectsCollectionActionTypes.RESET_FILTERS;
  public readonly module = ModuleTypes.SUBJECTS;
}
