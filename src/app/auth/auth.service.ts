import { MessagingService } from './../shared/messaging.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ErrorMsgComponent } from './../messages-box/error-msg/error-msg.component';
import { User } from './user';
import { Injectable, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { OkMsgComponent } from '../messages-box/ok-msg/ok-msg.component';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private authUser: boolean;
  private displayUserName: string;
  private userEmail: string;
  public userRoleEvent = new EventEmitter<string>();
  public displayUserNameEvent = new EventEmitter<string>();
  private newUser: boolean; // newUser = false , user not verifide , newUser = true , user virefide
  private userRoleSub: Subscription;

  constructor(
    private msgService: MessagingService,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router
  ) {
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
    this.msgService.messageSub.unsubscribe();
    this.userRoleSub.unsubscribe();
    return this.afAuth.auth.signOut();
  }

  public resetUserPasswordByEmail(email: string): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  public setUserRole(): Observable<any> {
    return this.db
      .collection('users')
      .doc(this.getUserId())
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return {
            id: docArray.payload.id,
            ...docArray.payload.data()
          };
        })
      );
  }

  public initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        if (user.emailVerified) {
          this.userRoleSub = this.setUserRole().subscribe(data => {
            this.userRoleEvent.emit(data.role);
            // console.log('User role: ', data.role);
          });

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
          this.msgService.receiveMessage();
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
