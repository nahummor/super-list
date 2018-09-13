import { MatDialog, MatSnackBar } from '@angular/material';
import { SnackBarMsgComponent } from './../../messages-box/snack-bar-msg/snack-bar-msg.component';
import { SppinerMsgBoxComponent } from './../../messages-box/sppiner-msg-box/sppiner-msg-box.component';
import { YesNoMsgComponent } from './../../messages-box/yes-no-msg/yes-no-msg.component';
import { SuperListService } from './../super-list.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SuperList } from '../super-list';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'nm-saved-shared-list',
  templateUrl: './saved-shared-list.component.html',
  styleUrls: ['./saved-shared-list.component.scss']
})
export class SavedSharedListComponent implements OnInit, OnDestroy {
  public isDoneLoading: boolean;
  public sharedLists: SuperList[];
  private getSharedListSub: Subscription;

  constructor(
    private superListService: SuperListService,
    private router: Router,
    private dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.isDoneLoading = false;
    this.getSharedListSub = this.superListService
      .getSharedLists()
      .subscribe(data => {
        this.sharedLists = data;
        this.isDoneLoading = true;
      });
  }

  ngOnDestroy() {
    this.getSharedListSub.unsubscribe();
  }

  public showList(list: SuperList) {
    this.superListService.setSharedList(list);
    this.router.navigate(['sharedListContainer']);
  }

  public onAddList(list: SuperList) {
    this.superListService.setSharedList(list);
    const dialogRef = this.dialog.open(YesNoMsgComponent, {
      width: '25rem',
      data: { message: 'האם להוסיף את הרשימה' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        const dialogRef2 = this.dialog.open(SppinerMsgBoxComponent, {
          width: '25rem',
          data: {
            message: `מוסיף רשימה`
          }
        });
        this.superListService
          .addSharedListToMyList()
          .subscribe((superList: SuperList) => {
            dialogRef2.close();
            const snakBarRef = this.snackBar.openFromComponent(
              SnackBarMsgComponent,
              {
                duration: 2000,
                data: { msg: 'הרשימה נוספה בהצלחה' }
              }
            );
          });
      }
    });
  }
}
