import { SnackBarMsgComponent } from './../messages-box/snack-bar-msg/snack-bar-msg.component';
import { MatSnackBar } from '@angular/material';
import { take } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  public currentMessage = new BehaviorSubject(null);
  public messageSub: Subscription;

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private afMessaging: AngularFireMessaging,
    private snackBar: MatSnackBar
  ) {
    this.afMessaging.messaging.subscribe(_messaging => {
      _messaging.onMessage = _messaging.onMessage.bind(_messaging);
      _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    });
  }

  public updateToken(token) {
    this.afAuth.authState.pipe(take(1)).subscribe(user => {
      if (!user) {
        return;
      }

      this.db
        .collection('shared-user', ref => {
          return ref.where('authorizedUserId', '==', user.uid);
        })
        .get()
        .subscribe(ref => {
          ref.docs.forEach(doc => {
            // console.log('Doc ID: ', doc.id);
            this.db
              .collection('shared-user')
              .doc(doc.id)
              .update({ sendToken: token, authorizedUserEmail: user.email });
          });
        });

      this.db
        .collection('shared-user', ref => {
          return ref.where('userId', '==', user.uid);
        })
        .get()
        .subscribe(ref => {
          ref.docs.forEach(doc => {
            this.db
              .collection('shared-user')
              .doc(doc.id)
              .update({ userToken: token });
          });
        });
    });
  }

  public getPermission() {
    this.afMessaging.requestToken.subscribe(
      token => {
        console.log('Request token', token);
        this.updateToken(token);
      },
      error => {
        console.error(error);
      }
    );
  }

  public receiveMessage() {
    this.messageSub = this.afMessaging.messages.subscribe(msg => {
      // console.log('FCM Message: ', msg);
      const snakBarRef = this.snackBar.openFromComponent(SnackBarMsgComponent, {
        duration: 4000,
        data: {
          msg: msg['notification']['title'] + ' ' + msg['notification']['body']
        }
      });
      this.currentMessage.next(msg);
    });
  }
}
