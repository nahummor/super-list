import { MatSnackBar } from '@angular/material';
import { ErrorMsgComponent } from './../../messages-box/error-msg/error-msg.component';
import { AuthService } from './../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'nm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public startLogin: boolean;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.startLogin = false;

    this.loginForm = new FormGroup({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  public onLogin() {
    this.startLogin = true;
    this.authService
      .loginUser(this.loginForm.value)
      .then(result => {
        console.log('Login Result: ', result);
        this.startLogin = false;
        // return true;
      })
      .catch(error => {
        this.startLogin = false;
        if (
          error.code === 'auth/invalid-email' ||
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/user-not-found'
        ) {
          const snackBarRef = this.snackBar.openFromComponent(
            ErrorMsgComponent,
            {
              data: { message: 'שם משתמש או סיסמה אינם נכונים' },
              duration: 4000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
              direction: 'rtl',
              panelClass: ['my-snack-bar']
            }
          );

          snackBarRef.afterDismissed().subscribe(() => {
            console.log('snack bar close');
          });

          snackBarRef.onAction().subscribe(() => {
            console.log('snack bar close with action');
          });
        } else {
          console.log(error);
        }
        // return false;
      });
  }

  public onLoginWithFacebook() {
    this.authService.loginUserWithFacebook().then(() => {
      // this.router.navigate(['/super-list']);
    });
  }
}
