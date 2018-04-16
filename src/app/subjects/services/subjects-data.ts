import { Injectable } from '@angular/core';
import { Api } from '../../core/services/api';
import {
  ISubject,
  ISubjectFilters,
  ISubjectQueryParams,
  ISubjectsResponse
} from '../models/subject';


@Injectable()
export class SubjectsData {
  constructor(private api: Api) {}

  public getSubjects(skip: number, limit: number, filters?: ISubjectFilters) {
    return this.api.get<ISubjectsResponse, ISubjectQueryParams>(
      'admin/rest/subjects',
      { skip, limit, ...filters }
    );
  }

  public saveChanges(subject:ISubject) {
    return this.api.put(`admin/rest/subjects/${subject._id}`, subject);
  }
}
