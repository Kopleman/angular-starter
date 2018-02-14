import { Observable } from 'rxjs/Observable';
import { ISubject } from './subject';

export interface ICloneDialogData {
  cloneName: string;
  author: string;
  type: 'pageLess' | 'normal';
}

export interface ICreateDialogData {
  templateId: string;
  title: string;
  about: string;
  subjects: Observable<ISubject[]>;
  selectedSubject: string;
}
