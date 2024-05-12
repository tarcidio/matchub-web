import { Region } from "../../enums/region/region";

export class HubUserBase {
  constructor(
    public nickname: string,
    public firstname: string,
    public lastname: string,
    public email: string,
    public region: Region
  ) {}
}
