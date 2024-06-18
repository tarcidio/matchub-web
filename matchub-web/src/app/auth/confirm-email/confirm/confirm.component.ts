import { Component, OnInit } from '@angular/core';
import { HubUserService } from '../../../main/shared/services/hub-user/hub-user.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss',
})
export class ConfirmComponent implements OnInit {
  title: string | undefined;
  message: string | undefined;
  token: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private hubUserService: HubUserService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) =>
          this.hubUserService.confirmEmail(params.get('token')!)
        )
      )
      .subscribe({
        next: () => {
          this.title = 'Email Verification Successful!';
          this.message =
            'Your email has been successfully verified. You can now access all the features of your account.';
        },
        error: (err) => {
          this.title = 'Email Verification Failed';
          this.message =
            'Unfortunately, we were unable to verify your email. ' +
            'This might be due to an expired or invalid verification link.';
        },
      });
  }
}