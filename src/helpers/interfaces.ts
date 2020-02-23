export interface IKitten {
	_id: String;
	name?: String;
	age?: Number;
	insertDate?: Date;
	originalName: String;
	savedName: string;
	size: Number;
	votes: Number;
	approved: Boolean;
}

export interface IUser {
	username: String;
	insertDate?: Date;
	method: String;
	account: {
		id: String;
		token: String;
	};
	score: Number;
	isAdmin: Boolean;
}

export enum Pages {
	'score' = "Score",
	'kittens' = "Kittens",
	'user' = 'User',
	'login' = 'Login',
	'logout' = 'Logout',
	'jwt' = 'JWT'
}

export const UnloggedPages = [
	Pages.login,
	Pages.score,
	Pages.jwt
]

export const LoggedPages = [
	Pages.kittens,
	Pages.user,
	Pages.logout
]