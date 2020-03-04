export type Partial<T> = {
	[P in keyof T]?: T[P];
};

export type SubjectData = {
	name: string;
	value: any;
	type?: 'number' | 'string';
};

export type KittenVote = {
	kittenVoted: String;
	kittenA: String;
	kittenB: String;
};
