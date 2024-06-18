import { EvaluationLinks } from '../../evaluation/evaluation-links/evaluation-links';
import { HubUserLinks } from '../../hub-user/hub-user-links/hub-user-links';
import { ScreenLinks } from '../../screen/screen-links/screen-links';
import { CommentBase } from '../comment-base/comment-base';

export class CommentDetails extends CommentBase {
  constructor(
    public override text: string,
    public id: number,
    public numGoodEvaluation: number,
    public numBadEvaluation: number,

    public creationDate: string,
    public creationTime: string,
    public updateDate: string,
    public updateTime: string,

    public hubUser: HubUserLinks,
    public screen: ScreenLinks,
    public evaluations: EvaluationLinks[],
    
  ) {
    super(text);
  }
}