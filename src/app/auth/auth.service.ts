import { ErrorMsgComponent } from './../messages-box/error-msg/error-msg.component';
import { User } from './user';
import { Injectable, EventEmitter } from '@angular/core';
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
  private displayUserName: string;
  private userEmail: string;
  public displayUserNameEvent = new EventEmitter<string>();
  private newUser: boolean; // newUser = false , user not verifide , newUser = true , user virefide

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.authUser = false;
    this.displayUserName = 'no name';
    this.newUser = false;
  }

  public isUserAuth(): boolean {
    return this.authUser;
  }

  public getUserEmail(): string {
    return this.userEmail;
  }

  public getUserId(): string {
    return this.afAuth.auth.currentUser.uid;
  }

  public getToken(): string {
    return this.token;
  }
  public setNewUser(state: boolean) {
    this.newUser = state;
  }

  public addNewUser(user: User): Promise<firebase.auth.UserCredential> {
    return this.afAuth.auth.createUserWithEmailAndPassword(
      user.userName,
      user.password
    );
  }

  public sendVerificationEmail(): Promise<void> {
    return this.afAuth.auth.currentUser.sendEmailVerification();
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

  public resetUserPasswordByEmail(email: string): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  public initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        if (user.emailVerified) {
          this.userEmail = user.email;
          this.newUser = false;
          this.displayUserName = user.displayName
            ? user.displayName
            : user.email;
          this.displayUserNameEvent.emit(this.displayUserName + ' : שלום');
          this.afAuth.auth.currentUser.getIdToken().then(token => {
            this.token = token;
            this.authUser = true;
            this.router.navigate(['/main']); // navigate to application
          });
        } else {
          this.newUser = true;
          this.sendVerificationEmail().then(() => {
            this.afAuth.auth.signOut();
            this.router.navigate(['userVerification']);
          });
        }
      } else {
        if (!this.newUser) {
          this.displayUserNameEvent.emit('');
          this.authUser = false;
          this.router.navigate(['/auth/login']);
        }
      }
    });
  }
}
