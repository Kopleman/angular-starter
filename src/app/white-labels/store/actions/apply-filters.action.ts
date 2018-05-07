import { WhiteLabelsCollectionActionTypes } from '../types';
import { ICustomAction, ModuleTypes } from '../../../shared/models/ngrx-action';
import { IWhiteLabelFilters } from '../../models/white-label';

export class WhiteLabelsApplyFilters implements ICustomAction {
	public readonly type = WhiteLabelsCollectionActionTypes.APPLY_FILTERS;
	public readonly feature = ModuleTypes.WHITELABELS;
	constructor(public filters: IWhiteLabelFilters) {}
}
