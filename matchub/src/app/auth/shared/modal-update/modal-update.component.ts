import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-update',
  templateUrl: './modal-update.component.html',
  styleUrl: './modal-update.component.scss',
})
export class ModalUpdateComponent {
  constructor(private router: Router){}

  isModalUpdate: boolean = false;
  titleModal: string | undefined;
  messageModal: string | undefined;
  urlBack: string | undefined;
  buttonName: string | undefined;

  public activateModalUpdate(
    title: string = 'Change Made',
    message: string = 'Your information has been updated successfully',
    urlBack: string = 'auth/login',
    buttonName: string = 'Back'
  ): void {
    this.isModalUpdate = true;
    this.titleModal = title;
    this.messageModal = message;
    this.urlBack = urlBack;
    this.buttonName = buttonName;
  }

  public disableModalUpdate(): void {
    this.isModalUpdate = false;
    this.router.navigate([this.urlBack]);
  }
}
