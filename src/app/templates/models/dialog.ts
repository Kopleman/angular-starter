import { Observable } from 'rxjs';
import { ISubject } from './subject';
import { ITemplate } from './template';

export interface ICloneDialogData {
	cloneName: string;
	author: string;
	type: 'pageLess' | 'normal';
}

export interface ICreateDialogData {
	templateId: string;
	title: string;
	about: string;
	author: string;
	subjects$: Observable<ISubject[]>;
	selectedSubject: string;
}

export interface IChangePropsDialogData {
	template: ITemplate;
	subjects$: Observable<ISubject[]>;
	selectedSubject: string;
	selectedWhiteLabel: string;
	newTags: { [key: string]: string };
}


export interface Ii18NDialogData {
	template: ITemplate;
}
