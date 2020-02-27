export type Partial<T> = {
	[P in keyof T]?: T[P];
};

export type SubjectData = {
	name: string;
	value: any;
};
