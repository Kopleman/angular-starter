import { SubjectsCollectionActionTypes } from '../types';
import { ICustomAction, ModuleTypes } from '../../../shared/models/ngrx-action';

export class SubjectsRefresh implements ICustomAction {
	public readonly type = SubjectsCollectionActionTypes.REFRESH;
	public readonly feature = ModuleTypes.SUBJECTS;
}
