import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/service/auth.service';
import { ForgotPassword } from '../../../classes/auth/forgot-password/forgot-password';
import { ModalUpdateComponent } from '../../shared/modal-update/modal-update.component';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.scss',
})
export class ForgotComponent {
  private errorMessage: string = '';
  @ViewChild(ModalUpdateComponent) modal: ModalUpdateComponent | undefined;

  form = this.fb.group({
    email: ['', Validators.email],
  });

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  get error() {
    return this.errorMessage;
  }

  get emailInvalid() {
    const control = this.form.get('email');
    return control?.hasError('email') && control?.touched;
  }

  public forgotPassword() {
    if (this.form.valid) {
      let hubUserEmail: string = this.form.get('email')?.value!;
      let messageModal: string =
        'If your email is linked to an existing account, we will send you a password' +
        'reset email within a few minutes. If you have not yet received the email, ' +
        'please check your spam folder or contact Player Support.';
      // Preparando a função para ser chamada após a resposta da API
      const showModal = () =>
        this.modal!.activateModalUpdate(
          'Email Sent',
          messageModal,
          'auth/login',
          'Back to login'
        );
      this.authService
        .forgotPassword(new ForgotPassword(hubUserEmail))
        .subscribe({
          next: () => {
            showModal();
          },
          error: (err) => {
            showModal();
          },
        });
    }
  }
}
