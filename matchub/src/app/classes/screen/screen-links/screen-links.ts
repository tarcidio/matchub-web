import { Known } from '../../enums/known/known';
import { ScreenBase } from '../screen-base/screen-base';

export class ScreenLinks extends ScreenBase {
    constructor(
      public override known: Known,
      public id: number,
      public spotlightId: number,
      public opponentId: number
    ) {
      super(known);
    }
  }