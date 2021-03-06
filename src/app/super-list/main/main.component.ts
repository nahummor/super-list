import { MessageComponent } from './../../admin-messages/message/message.component';
import { SnackBarMsgComponent } from './../../messages-box/snack-bar-msg/snack-bar-msg.component';
import { AddNewListComponent } from './../add-new-list/add-new-list.component';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked
} from '@angular/core';
import { SuperListService } from '../super-list.service';

@Component({
  selector: 'nm-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router,
    private superListSrvice: SuperListService
  ) {}

  ngOnInit() {
    this.superListSrvice.setUserId();

    if (this.superListSrvice.showAdminMessages) {
      setTimeout(() => {
        const dialogRef1 = this.dialog.open(MessageComponent, {
          width: '25rem'
        });
        this.superListSrvice.showAdminMessages = false;
      }, 10);
    }
  }

  public onAddNewList() {
    const dialogRef = this.dialog.open(AddNewListComponent, {
      width: '25rem'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'add-new-list') {
        const snakBarRef = this.snackBar.openFromComponent(
          SnackBarMsgComponent,
          {
            duration: 2500,
            data: { msg: 'רשימה חדשה נקלטה בהצלחה' }
          }
        );
      }
    });
  }

  public onGetMyLists() {
    this.router.navigate(['savedList']);
  }

  public onSharedMyLists() {
    this.router.navigate(['mainSharedUserList']);
  }

  public onGetSharedUsers() {
    this.router.navigate(['mySharedUsers']);
  }

  public onGetSharedList() {
    this.router.navigate(['savedSharedList']);
  }
}
