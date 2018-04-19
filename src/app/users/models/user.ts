export interface IUserFilters {
  searchStr?: string;
  sortBy?: string;
}

export interface IUserQueryParams extends IUserFilters{
  skip: number;
  limit: number;
}

export interface IUser {
  email: string;
  created: string;
  firstName: string;
  lastName: string;
  role: string;
  phone: string;
}

export interface IUsersResponse {
  count: number;
  users: IUser[];
}

export interface IUserRole {
  name: string;
  value: string;
}
