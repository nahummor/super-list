import { SppinerMsgBoxComponent } from './../../messages-box/sppiner-msg-box/sppiner-msg-box.component';
import { UpdateListDetailesComponent } from './../update-list-detailes/update-list-detailes.component';
import { SnackBarMsgComponent } from './../../messages-box/snack-bar-msg/snack-bar-msg.component';
import { YesNoMsgComponent } from './../../messages-box/yes-no-msg/yes-no-msg.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { SuperListService } from './../super-list.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SuperList } from '../super-list';
import { Subscription } from 'rxjs';

@Component({
  selector: 'nm-saved-list',
  templateUrl: './saved-list.component.html',
  styleUrls: ['./saved-list.component.scss']
})
export class SavedListComponent implements OnInit, OnDestroy {
  public userLists: SuperList[];
  public isDoneLoading: boolean;
  private getUserListsSub: Subscription;

  constructor(
    private superListService: SuperListService,
    private router: Router,
    private dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.isDoneLoading = false;
    this.getUserListsSub = this.superListService
      .getUserLists()
      .subscribe((data: SuperList[]) => {
        this.userLists = data;
        this.isDoneLoading = true;
      });
  }

  ngOnDestroy() {
    this.getUserListsSub.unsubscribe();
  }

  public showList(list: SuperList) {
    this.router.navigate([
      '/listContainer',
      list.name,
      list.description,
      list.id
    ]);
  }

  public onListDelete(list: SuperList) {
    const dialogRef = this.dialog.open(YesNoMsgComponent, {
      width: '25rem',
      data: { message: 'האם למחוק את הרשימה' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        const dialogRef1 = this.dialog.open(SppinerMsgBoxComponent, {
          width: '25rem',
          data: {
            message: `מוחק רשימה`
          }
        });

        this.superListService.deleteList(list.id).subscribe(data => {
          dialogRef1.close();
          const snakBarRef = this.snackBar.openFromComponent(
            SnackBarMsgComponent,
            {
              duration: 2000,
              data: { msg: 'הרשימה נמחקה בהצלחה' }
            }
          );
          // console.log('delete list data: ', data);
        });
      }
    });
  }

  public onListUpdate(list: SuperList) {
    const dialogRef = this.dialog.open(UpdateListDetailesComponent, {
      width: '25rem',
      data: {
        id: list.id,
        name: list.name,
        description: list.description
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'update') {
        const snakBarRef = this.snackBar.openFromComponent(
          SnackBarMsgComponent,
          {
            duration: 2000,
            data: { msg: 'עדכון בוצע בהצלחה' }
          }
        );
      }
    });
  }
}
