import { Observable } from 'rxjs/Observable';
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
