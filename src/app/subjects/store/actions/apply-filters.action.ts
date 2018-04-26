import { SubjectsCollectionActionTypes } from '../types';
import { ISubjectFilters } from '../../models/subject';
import { ICustomAction, ModuleTypes } from '../../../shared/models/ngrx-action';

export class SubjectsApplyFilters implements ICustomAction {
	public readonly type = SubjectsCollectionActionTypes.APPLY_FILTERS;
	public readonly feature = ModuleTypes.SUBJECTS;
	constructor(public filters: ISubjectFilters) {}
}
