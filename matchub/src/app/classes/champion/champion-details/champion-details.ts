import { ChampionBase } from '../champion-base/champion-base';

export class ChampionDetails extends ChampionBase {
  constructor(
    public override name: string,
    public id: number,
    public img: number[]
  ) {
    super(name);
  }
}
