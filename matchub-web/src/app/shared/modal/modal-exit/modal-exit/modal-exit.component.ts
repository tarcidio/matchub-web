import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-exit',
  templateUrl: './modal-exit.component.html',
  styleUrl: './modal-exit.component.scss'
})
export class ModalExitComponent {
  constructor(private router: Router, private sanitizer: DomSanitizer) {}

  isModalExit: boolean = false;
  titleModal: string | undefined;
  messageModal: string | undefined;
  urlBack: string | undefined;
  exitFunction: Function = () => {}

  public activateModalExit(
    exitFunction: Function = () => {},
    title: string = 'Confirmation',
    message: string = 'Do you really want to leave?',
    urlBack: string = 'auth/login'
  ): void {
    this.exitFunction = exitFunction;
    this.isModalExit = true;
    this.titleModal = title;
    this.messageModal = message;
    this.urlBack = urlBack;
  }

  // SafeHtml: tipo de dado definido no Angular para indicar que um valor HTML é
  // seguro para ser usado, ou seja, está livre de elementos maliciosos que poderiam causar ataques de Cross-Site Scripting (XSS)
  // DomSanitizer: sanitiza o HTML para garantir que não haja conteúdo malicioso
  get formattedMessage(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      this.messageModal?.replace(/\n/g, '<br>') || ''
    );
  }

  public disableModalExit(): void {
    this.isModalExit = false;
  }

  public confirmExit(): void {
    this.isModalExit = false;
    this.router.navigate([this.urlBack]);
    this.exitFunction();
  }
}
