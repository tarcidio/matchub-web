import { HubUserBase } from '../hub-user-base/hub-user-base';
import { Region } from '../../enums/region/region';
import { Role } from '../../enums/role/role';
import { Hability } from '../../enums/hability/hability';

export class HubUserLinks extends HubUserBase {
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
    public masteryId: number,
    public creation: string,
    public update: string
  ) {
    super(nickname, firstname, lastname, email, region);
  }
}
