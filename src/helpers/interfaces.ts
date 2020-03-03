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
