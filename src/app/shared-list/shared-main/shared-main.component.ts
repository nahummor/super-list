import { Router } from '@angular/router';
import { SnackBarMsgComponent } from './../../messages-box/snack-bar-msg/snack-bar-msg.component';
import { AddNewSharedListComponent } from './../add-new-shared-list/add-new-shared-list.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nm-shared-main',
  templateUrl: './shared-main.component.html',
  styleUrls: ['./shared-main.component.scss']
})
export class SharedMainComponent implements OnInit {
  constructor(
    private router: Router,
    private dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  public onAddNewSharedList() {
    const dialogRef = this.dialog.open(AddNewSharedListComponent, {
      width: '25rem'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'add-new-shared-list') {
        const snakBarRef = this.snackBar.openFromComponent(
          SnackBarMsgComponent,
          {
            duration: 2500,
            data: { msg: 'רשימה חדשה משותפת נקלטה בהצלחה' }
          }
        );
      }
    });
  }

  public onGetSharedLists() {
    this.router.navigate(['sharedList', 'savedList']);
  }
}
