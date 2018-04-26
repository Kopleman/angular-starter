import { CollectionActionTypes } from '../types';
import { ITemplateFilters } from '../../models/template';
import { ICustomAction, ModuleTypes } from '../../../shared/models/ngrx-action';

export class ApplyFilters implements ICustomAction {
	public readonly type = CollectionActionTypes.APPLY_FILTERS;
	public readonly feature = ModuleTypes.TEMPLATES;

	constructor(public filters: ITemplateFilters) {}
}
