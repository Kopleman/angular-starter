import { Observable } from 'rxjs/Observable';
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
  subjects$: Observable<ISubject[]>;
  selectedSubject: string;
}

export interface IChangePropsDialogData {
  template: ITemplate;
  subjects: ISubject[];
  selectedSubject: string;
  selectedWhiteLabel: string;
}
