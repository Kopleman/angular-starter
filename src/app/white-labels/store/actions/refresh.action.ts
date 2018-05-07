import { WhiteLabelsCollectionActionTypes } from '../types';
import { ICustomAction, ModuleTypes } from '../../../shared/models/ngrx-action';

export class WhiteLabelsRefresh implements ICustomAction {
	public readonly type = WhiteLabelsCollectionActionTypes.REFRESH;
	public readonly feature = ModuleTypes.WHITE;
}
