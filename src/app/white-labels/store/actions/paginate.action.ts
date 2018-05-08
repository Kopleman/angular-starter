import { WhiteLabelsCollectionActionTypes } from '../types';
import { ICustomAction, ModuleTypes } from '../../../shared/models/ngrx-action';

export class WhiteLabelsPaginate implements ICustomAction {
	public readonly type = WhiteLabelsCollectionActionTypes.PAGINATE;
	public readonly feature = ModuleTypes.WHITELABELS;
	constructor(public skip: number, public limit: number) {}
}
