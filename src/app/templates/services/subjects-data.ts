import { Injectable } from '@angular/core';
import { Api } from '../../core/services/api';
import { ISubject } from '../models/subject';

@Injectable()
export class SubjectsData {
  constructor(private api: Api) {}

  public getSubjects() {
    return this.api.get<ISubject[], null>(
      'admin/rest/subjects'
    );
  }
}
