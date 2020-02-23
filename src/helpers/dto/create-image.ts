import {
	Length,
	Max,
	IsInt,
	Equals
} from 'class-validator';
import { DtoBase } from './base';

export const MAX_IMAGE_SIZE = 16 * 1024 * 1024 - 1; // 16 MB

export class CreateImageDto extends DtoBase {
	constructor(file: File) {
		super();
		this.name = file.name;
		this.type = file.type;
		this.size = file.size;
	}

	@Length(1, 40)
	name: String;

	@Equals('image/jpeg')
	type: String;

	@IsInt()
	@Max(MAX_IMAGE_SIZE)
	size: Number;
}
