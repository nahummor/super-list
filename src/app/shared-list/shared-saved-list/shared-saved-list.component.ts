import { UpdateSharedListDetailesComponent } from './../update-shared-list-detailes/update-shared-list-detailes.component';
import { YesNoMsgComponent } from './../../messages-box/yes-no-msg/yes-no-msg.component';
import { SnackBarMsgComponent } from './../../messages-box/snack-bar-msg/snack-bar-msg.component';
import { SppinerMsgBoxComponent } from './../../messages-box/sppiner-msg-box/sppiner-msg-box.component';
import { SharedListService } from './../../shared-list/shared-list.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SuperList } from '../../super-list/super-list';
import { Subscription } from 'rxjs';

@Component({
  selector: 'nm-shared-saved-list',
  templateUrl: './shared-saved-list.component.html',
  styleUrls: ['./shared-saved-list.component.scss']
})
export class SharedSavedListComponent implements OnInit, OnDestroy {
  public userLists: SuperList[];
  public isDoneLoading: boolean;
  private getSharedListSub: Subscription;

  constructor(
    private sharedListService: SharedListService,
    private router: Router,
    private dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.isDoneLoading = false;
    this.getSharedListSub = this.sharedListService
      .getSharedList()
      .subscribe((data: SuperList[]) => {
        this.userLists = data;
        this.isDoneLoading = true;
      });
  }

  ngOnDestroy() {
    this.getSharedListSub.unsubscribe();
  }

  public showList(list: SuperList) {
    this.router.navigate([
      'sharedList/listContainer',
      list.name,
      list.description
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

        this.sharedListService.deleteList(list.id).then(payload => {
          payload.subscribe(data => {
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
        });
      }
    });
  }

  public onListUpdate(list: SuperList) {
    const dialogRef = this.dialog.open(UpdateSharedListDetailesComponent, {
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
