import { CommentLinks } from '../../comment/comment-links/comment-links';
import { EvaluationLevel } from '../../enums/evaluation-level/evaluation-level';
import { HubUserLinks } from '../../hub-user/hub-user-links/hub-user-links';
import { EvaluationBase } from '../evaluation-base/evaluation-base';

export class EvaluationDetails extends EvaluationBase {
  constructor(
    public override level: EvaluationLevel,
    public id: number,

    public hubUser: HubUserLinks,
    public comment: CommentLinks,
    public creation: string,
    public update: string,
  ) {
    super(level);
  }
}