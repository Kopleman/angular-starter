import { SubjectsCollectionActionTypes } from '../types';
import { CustomAction, ModuleTypes } from '../../../shared/models/ngrx-action';

export class SubjectsRefresh implements CustomAction {
  public readonly type = SubjectsCollectionActionTypes.REFRESH;
  public readonly module = ModuleTypes.SUBJECTS;
}
