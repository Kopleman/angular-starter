export interface ILoginModel {
	email: string;
	password: string;
}

export interface IProfile {
	email: string;
	role: string;
}

export interface ILoginResponse {
	user: IProfile;
}
