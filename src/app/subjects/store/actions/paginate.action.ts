import { SubjectsCollectionActionTypes } from '../types';
import { CustomAction, ModuleTypes } from '../../../shared/models/ngrx-action';

export class SubjectsPaginate implements CustomAction {
  public readonly type = SubjectsCollectionActionTypes.PAGINATE;
  public readonly module = ModuleTypes.SUBJECTS;
  constructor(public skip: number, public limit: number) {}
}
