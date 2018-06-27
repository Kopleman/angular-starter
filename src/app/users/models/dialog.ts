import { Observable } from 'rxjs';
import { IUser, IUserRole } from './user';

export interface ICreateUserDialogData {
	rolesList$: Observable<IUserRole[]>;
	password: string;
	email: string;
	firstName: string;
	lastName: string;
	role: string;
	phone: string;
}

export interface IEditUserDialogData extends IUser {
	rolesList$: Observable<IUserRole[]>;
	password: string;
}
