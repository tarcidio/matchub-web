import { CommentBase } from "../comment-base/comment-base";

export class CommentLinks extends CommentBase{
    constructor(
        public override text: string,
        public id: number,
        public numGoodEvaluation: number,
        public numBadEvaluation: number,
    
        public creationDate: string,
        public creationTime: string,
        public updateDate: string,
        public updateTime: string,
    
        public hubUserId: number,
        public screenId: number,
        
      ) {
        super(text);
      }
}
