import { IsMongoId } from 'class-validator';
import { DtoBase } from './base';

export class KittenVoteDto extends DtoBase {
    constructor(obj: any){
        super();
        this.kittenVoted=obj?.kittenVoted;
        this.kittenA=obj?.kittenA;
        this.kittenB=obj?.kittenB;
    }
    
	@IsMongoId()
	kittenVoted: String;

	@IsMongoId()
	kittenA: String;

	@IsMongoId()
	kittenB: String;
}
