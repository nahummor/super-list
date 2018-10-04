// import { MessagingService } from './shared/messaging.service';
import { AuthService } from './auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'nm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {}
  // private msgService: MessagingService
  ngOnInit() {
    this.authService.initAuthListener();
    // this.msgService.getPermission();
  }

  ngOnDestroy() {
    // this.msgService.messageSub.unsubscribe();
  }
}
