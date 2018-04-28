export interface IUserFilters {
	searchStr?: string;
	sortBy?: string;
}

export interface IUserQueryParams extends IUserFilters {
	skip: number;
	limit: number;
}

export interface INewUser {
	email: string;
	firstName: string;
	lastName: string;
	role: string;
	phone: string;
	password: string;
}

export interface IUser {
	_id: string;
	email: string;
	created: string;
	firstName: string;
	lastName: string;
	role: string;
	phone: string;
}

export interface IEditUser extends IUser{
  password: string;
}

export interface IUsersResponse {
	count: number;
	users: IUser[];
}

export interface IUserRole {
	name: string;
	value: string;
}
