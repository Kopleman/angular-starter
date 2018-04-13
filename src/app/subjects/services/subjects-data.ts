import { Injectable } from '@angular/core';
import { Api } from '../../core/services/api';
import { ISubjectFilters, ISubjectQueryParams, ISubjectsResponse } from '../models/subject';


@Injectable()
export class SubjectsData {
  constructor(private api: Api) {}

  public getSubjects(skip: number, limit: number, filters?: ISubjectFilters) {
    return this.api.get<ISubjectsResponse, ISubjectQueryParams>(
      'admin/rest/subjects',
      { skip, limit, ...filters }
    );
  }
}
