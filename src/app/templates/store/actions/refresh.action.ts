import { Action } from '@ngrx/store';
import { CollectionActionTypes } from '../types';
import { ICustomAction, ModuleTypes } from '../../../shared/models/ngrx-action';

export class Refresh implements ICustomAction {
	public readonly feature = ModuleTypes.TEMPLATES;
	public readonly type = CollectionActionTypes.REFRESH;
}
