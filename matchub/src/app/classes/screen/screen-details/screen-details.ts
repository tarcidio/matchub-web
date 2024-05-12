import { ChampionDetails } from '../../champion/champion-details/champion-details';
import { CommentDetails } from '../../comment/comment-details/comment-details';
import { Known } from '../../enums/known/known';
import { ScreenBase } from '../screen-base/screen-base';

export class ScreenDetails extends ScreenBase {
  constructor(
    public override known: Known,
    public id: number,
    public spotlight: ChampionDetails,
    public opponent: ChampionDetails,
    public comments: CommentDetails[]
  ) {
    super(known);
  }
}
