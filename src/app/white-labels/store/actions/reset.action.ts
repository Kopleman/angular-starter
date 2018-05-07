import { WhiteLabelsCollectionActionTypes } from '../types';
import { ICustomAction, ModuleTypes } from '../../../shared/models/ngrx-action';

export class WhiteLabelsResetFilters implements ICustomAction {
	public readonly type = WhiteLabelsCollectionActionTypes.RESET_FILTERS;
	public readonly feature = ModuleTypes.WHITE;
}
