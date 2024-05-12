import { HubUserBase } from '../hub-user-base/hub-user-base';
import { Region } from '../../enums/region/region';
import { Role } from '../../enums/role/role';
import { Hability } from '../../enums/hability/hability';
import { ChampionLinks } from '../../champion/champion-links/champion-links';
import { CommentLinks } from '../../comment/comment-links/comment-links';
import { EvaluationLinks } from '../../evaluation/evaluation-links/evaluation-links';

export class HubUserDetails extends HubUserBase {
  constructor(
    public override nickname: string,
    public override firstname: string,
    public override lastname: string,
    public override email: string,
    public override region: Region,

    public id: number,
    public summonerName: string,
    public blocked: boolean,
    public role: Role,
    public abilityLevel: Hability,
    public mastery: ChampionLinks,
    public creation: string,
    public update: string,
    public comments: CommentLinks[],
    public evaluations: EvaluationLinks[]
  ) {
    super(nickname, firstname, lastname, email, region);
  }
}
