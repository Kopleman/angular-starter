export interface ISubject {
  whitelabelsIds:  string[];
  _id: string;
  title: string;
}

export interface ISubjectFilters {
  searchStr?: string;
  sortBy?: string;
}

export interface ISubjectQueryParams extends ISubjectFilters {
  skip: number;
  limit: number;
}

export interface ISubjectsResponse {
  count: number;
  subjects: ISubject[];
}

