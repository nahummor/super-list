import { AuthService } from './../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nm-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public resetPasswordForm: FormGroup;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.resetPasswordForm = new FormGroup({
      userName: new FormControl('', [Validators.required, Validators.email])
    });
  }

  public onResetPassword() {
    console.log('User Email: ', this.resetPasswordForm.value);

    this.authService
      .resetUserPasswordByEmail(this.resetPasswordForm.value.userName)
      .then(
        () => {
          console.log('Send Password reset email....');
        },
        error => {
          console.log('Error Reset Password: ', error);
        }
      );
  }
}
