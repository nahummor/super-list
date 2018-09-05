import { ErrorMsgComponent } from './../messages-box/error-msg/error-msg.component';
import { User } from './user';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { OkMsgComponent } from '../messages-box/ok-msg/ok-msg.component';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private authUser: boolean;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.authUser = false;
  }

  public isUserAuth(): boolean {
    return this.authUser;
  }

  public getUserId(): string {
    return this.afAuth.auth.currentUser.uid;
  }

  public getToken(): string {
    return this.token;
  }

  public addNewUser(user: User): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.createUserWithEmailAndPassword(
      user.userName,
      user.password
    );
  }

  public loginUser(user: User): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.signInWithEmailAndPassword(
      user.userName,
      user.password
    );
  }

  public loginUserWithFacebook() {
    return this.afAuth.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider()
    );
  }

  public logout() {
    return this.afAuth.auth.signOut();
  }

  public initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.afAuth.auth.currentUser.getIdToken().then(token => {
          this.token = token;
        });
        this.authUser = true;
        this.router.navigate(['/main']); // navigate to application
      } else {
        this.authUser = false;
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
