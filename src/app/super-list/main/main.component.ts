import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nm-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {}

  public onAddNewList() {
    // const dialogRef = this.dialog.open(AddNewListComponent, {
    //   width: '25rem'
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result === 'add-new-list') {
    //     const snakBarRef = this.snackBar.openFromComponent(
    //       SnackBarMsgComponent,
    //       {
    //         duration: 2500,
    //         data: { msg: 'רשימה חדשה נקלטה בהצלחה' }
    //       }
    //     );
    //   }
    // });
  }

  public onGetMyLists() {
    // this.router.navigate(['savedList']);
  }
}
