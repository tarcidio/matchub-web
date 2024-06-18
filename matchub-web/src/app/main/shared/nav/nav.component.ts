import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { HubUserService } from '../services/hub-user/hub-user.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit, OnDestroy{

  // Subject to trigger unsubscription upon component destruction
  private destroy$ = new Subject<void>();
  nickname$: Observable<string> | undefined;
  hubUserImg$: Observable<string> | undefined;

  constructor(private hubUserService: HubUserService){}
  
  ngOnInit(): void {
    this.hubUserService.getLoggedHubUser().pipe(takeUntil(this.destroy$)).subscribe();
    this.nickname$ = this.hubUserService.getNickNameHubUser();
    this.hubUserImg$ = this.hubUserService.getImgLoggedHubUser();
  }

  ngOnDestroy(): void {
    // Complete the destroy$ subject to clean up the subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }
}
