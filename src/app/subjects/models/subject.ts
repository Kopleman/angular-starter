export interface ISubject {

}

export interface ISubjectFilters {
  searchStr?: string;
  sortBy?: string;
}

export interface ISubjectQueryParams extends ISubjectFilters{
  skip: number;
  limit: number;
}

export interface ISubjectsResponse {
  count: number;
  subjects: ISubject[];
}

