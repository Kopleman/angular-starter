import { Injectable } from '@angular/core';
import { Api } from '../services/api';
import 'rxjs/add/operator/do';

export interface ISubject {
  _id: string;
  title: string;
}

@Injectable()
export class SubjectsData {
  constructor(private api: Api) {}

  public getSubjects() {
    return this.api.get<ISubject[], null>(
      'admin/rest/subjects'
    );
  }
}
