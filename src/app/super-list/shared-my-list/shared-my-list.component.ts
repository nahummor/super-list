import { SnackBarMsgComponent } from './../../messages-box/snack-bar-msg/snack-bar-msg.component';
import { ErrorMsgComponent } from './../../messages-box/error-msg/error-msg.component';
import { SppinerMsgBoxComponent } from './../../messages-box/sppiner-msg-box/sppiner-msg-box.component';
import { YesNoMsgComponent } from './../../messages-box/yes-no-msg/yes-no-msg.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SuperListService } from './../super-list.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'nm-shared-my-list',
  templateUrl: './shared-my-list.component.html',
  styleUrls: ['./shared-my-list.component.scss']
})
export class SharedMyListComponent implements OnInit {
  public sharedMyListForm: FormGroup;

  constructor(
    private superListService: SuperListService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.sharedMyListForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  public onSharedMyList() {
    const dialogRef = this.dialog.open(YesNoMsgComponent, {
      width: '25rem',
      data: { message: 'האם לשתף את הרשימות' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        const dialogRef1 = this.dialog.open(SppinerMsgBoxComponent, {
          width: '25rem',
          data: {
            message: `משתף רשימות`
          }
        });

        this.superListService
          .shareMyList(this.sharedMyListForm.value.email)
          .subscribe(
            data => {
              // console.log('Share user list: ', data);
              dialogRef1.close();
              // שיתוף בוצע בהצלחה
              if (data['messageNum'] === 1) {
                const snackBarRef1 = this.snackBar.openFromComponent(
                  SnackBarMsgComponent,
                  {
                    data: { msg: data['message'] },
                    duration: 4000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center',
                    direction: 'rtl'
                  }
                );
              }
              // שיתוף כבר קיים
              if (data['messageNum'] === 0) {
                const snackBarRef2 = this.snackBar.openFromComponent(
                  ErrorMsgComponent,
                  {
                    data: { message: data['message'] },
                    duration: 4000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center',
                    direction: 'rtl',
                    panelClass: ['my-snack-bar']
                  }
                );
              }
            },
            errorObj => {
              dialogRef1.close();
              if (errorObj.error.error.code === 'auth/user-not-found') {
                const snackBarRef3 = this.snackBar.openFromComponent(
                  ErrorMsgComponent,
                  {
                    data: { message: 'לא ניתן לאתר את המשתמש' },
                    duration: 4000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center',
                    direction: 'rtl',
                    panelClass: ['my-snack-bar']
                  }
                );
              }
            }
          );
      }
    });
  }
}
