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
    this.cameraPolyfills();
  }

  ngOnDestroy() {
    // this.msgService.messageSub.unsubscribe();
  }

  private cameraPolyfills() {
    const browser = <any>navigator;
    if (!('mediaDevices' in navigator)) {
      browser.mediaDevices = {};
    }

    if (!('getUserMedia' in browser.mediaDevices)) {
      browser.mediaDevices.getUserMedia = constraints => {
        const getUserMedia =
          browser.webkitGetUserMedia || browser.mozGetUserMedia;

        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented'));
        }

        return new Promise((resolve, reject) => {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }
  }
}
