import { SubjectsCollectionActionTypes } from '../types';
import { ICustomAction, ModuleTypes } from '../../../shared/models/ngrx-action';

export class SubjectsResetFilters implements ICustomAction {
	public readonly type = SubjectsCollectionActionTypes.RESET_FILTERS;
	public readonly feature = ModuleTypes.SUBJECTS;
}
