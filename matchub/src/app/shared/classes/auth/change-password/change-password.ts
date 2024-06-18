export class ChangePassword {
  constructor(
    public currentPassword: string,
    public newPassword: string,
    public confirmationPassword: string
  ) {}
}
