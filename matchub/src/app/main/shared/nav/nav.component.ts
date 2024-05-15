import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HubUserService } from '../services/hub-user/hub-user.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit{

  constructor(private hubUserService: HubUserService){}

  nickname$: Observable<string> | undefined;
  hubUserImg$: Observable<string> | undefined;

  ngOnInit(): void {
    this.nickname$ = this.hubUserService.getNicknameHubUser();
    this.hubUserImg$ = this.hubUserService.getImgHubUser();
  }

}
