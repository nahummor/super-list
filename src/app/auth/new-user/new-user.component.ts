import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { OkMsgComponent } from './../../messages-box/ok-msg/ok-msg.component';
import { ErrorMsgComponent } from './../../messages-box/error-msg/error-msg.component';
import { AuthService } from './../auth.service';
import { AppValidators } from './../../shared/app.validators';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'nm-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  public isDoneAddingUser: boolean;
  public addUserForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isDoneAddingUser = true;
    this.addUserForm = new FormGroup({
      userName: new FormControl('', [Validators.required, Validators.email]),
      pass: new FormGroup(
        {
          password: new FormControl('', [
            Validators.required,
            Validators.minLength(6)
          ]),
          confirmPassword: new FormControl('', [
            Validators.required,
            Validators.minLength(6)
          ])
        },
        AppValidators.matchingPasswordValidator
      )
    });
  }

  public onAddUser() {
    this.isDoneAddingUser = false;
    const newUser = {
      userName: this.addUserForm.value.userName,
      password: this.addUserForm.value.pass.password
    };
    this.authService
      .addNewUser(newUser)
      .then(result => {
        this.isDoneAddingUser = true;
        // יצירת הודעה משתמש חדש נוצר בהצלחה
        const dialogRef = this.dialog.open(OkMsgComponent, {
          width: '25rem',
          data: { message: 'משתמש חדש נוצר בהצלחה' }
        });

        dialogRef.afterClosed().subscribe(ans => {
          this.router.navigate(['/auth/login']);
        });
      })
      .catch(error => {
        // console.log(error);
        this.isDoneAddingUser = true;
        if (error.code === 'auth/email-already-in-use') {
          const snackBarRef = this.snackBar.openFromComponent(
            ErrorMsgComponent,
            {
              data: { message: 'שם משתמש תפוס' },
              duration: 4000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
              direction: 'rtl',
              panelClass: ['my-snack-bar']
            }
          );
        }
      });
  }
}
