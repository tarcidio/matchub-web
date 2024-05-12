import { ChampionBase } from "../champion-base/champion-base";

export class ChampionLinks extends ChampionBase{
    constructor(
        public override name: string,
        public id: number
      ) {
        super(name);
      }
}
