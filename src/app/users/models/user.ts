export interface IUserFilters {
  searchStr?: string;
  sortBy?: string;
}

export interface IUserQueryParams extends IUserFilters{
  skip: number;
  limit: number;
}
