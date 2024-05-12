import { EvaluationLevel } from '../../enums/evaluation-level/evaluation-level';
import { EvaluationBase } from '../evaluation-base/evaluation-base';

export class EvaluationLinks extends EvaluationBase {
    constructor(
      public override level: EvaluationLevel,
      public id: number,
  
      public hubUserId: number,
      public commentId: number,
      public creation: string,
      public update: string,
    ) {
      super(level);
    }
  }