import { Action } from '@ngrx/store';

export interface ICustomAction extends Action {
	type: string;
	feature: string;
}
export enum ModuleTypes {
	TEMPLATES = 'template',
	SUBJECTS = 'subjects',
	USERS = 'users',
	WHITELABELS = 'white-labels'
}
