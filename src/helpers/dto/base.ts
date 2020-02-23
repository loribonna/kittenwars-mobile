import { validate, validateOrReject } from 'class-validator';

export class DtoBase {
	constructor() {}

	validate = () => validate(this);
	validateOrReject = () => validateOrReject(this);
}
