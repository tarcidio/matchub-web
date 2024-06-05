import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-update',
  templateUrl: './modal-update.component.html',
  styleUrl: './modal-update.component.scss',
})
export class ModalUpdateComponent {
  constructor(private router: Router, private sanitizer: DomSanitizer) {}

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

  // SafeHtml: tipo de dado definido no Angular para indicar que um valor HTML é
  // seguro para ser usado, ou seja, está livre de elementos maliciosos que poderiam causar ataques de Cross-Site Scripting (XSS)
  // DomSanitizer: sanitiza o HTML para garantir que não haja conteúdo malicioso
  get formattedMessage(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      this.messageModal?.replace(/\n/g, '<br>') || ''
    );
  }

  public disableModalUpdate(): void {
    this.isModalUpdate = false;
    this.router.navigate([this.urlBack]);
  }
}
