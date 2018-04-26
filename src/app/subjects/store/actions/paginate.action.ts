import { SubjectsCollectionActionTypes } from '../types';
import { ICustomAction, ModuleTypes } from '../../../shared/models/ngrx-action';

export class SubjectsPaginate implements ICustomAction {
	public readonly type = SubjectsCollectionActionTypes.PAGINATE;
	public readonly feature = ModuleTypes.SUBJECTS;
	constructor(public skip: number, public limit: number) {}
}
