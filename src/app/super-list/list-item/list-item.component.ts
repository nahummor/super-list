import { ShowBigPictureComponent } from './../../show-big-picture/show-big-picture.component';
import { Router } from '@angular/router';
import { SppinerMsgBoxComponent } from './../../messages-box/sppiner-msg-box/sppiner-msg-box.component';
import { UpdateItemComponent } from './../update-item/update-item.component';
import { YesNoMsgComponent } from './../../messages-box/yes-no-msg/yes-no-msg.component';
import { Item } from './../item';
import { SnackBarMsgComponent } from './../../messages-box/snack-bar-msg/snack-bar-msg.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SuperListService } from './../super-list.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'nm-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent implements OnInit {
  @Input()
  id: number;
  @Input()
  updateItemId: number;
  @Input()
  name: string;
  @Input()
  amount: number;
  @Input()
  description: string;
  @Input()
  cost: number;
  @Input()
  measure: string;
  @Input()
  done: boolean;
  @Input()
  opButton: boolean;
  @Input()
  sharedUser: boolean;
  @Input()
  userId: string;
  @Input()
  listId: string;
  @Input()
  pictureUrl: string;

  public checked: boolean;
  public imgUrl: string;
  public loadingGifUrl: string;
  public doneLoadingPicture: boolean;

  constructor(
    private router: Router,
    private superListSrvc: SuperListService,
    private dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.doneLoadingPicture = false;
    this.loadingGifUrl = 'assets/img/loading.gif';
    if (this.pictureUrl) {
      this.imgUrl = this.pictureUrl;
    } else {
      this.imgUrl = 'assets/img/superList.PNG';
    }
    this.checked = this.done;
  }

  public onDoneLoadingPicture() {
    this.doneLoadingPicture = true;
  }

  public deleteItem() {
    const dialogRef = this.dialog.open(YesNoMsgComponent, {
      width: '25rem',
      data: { message: 'האם למחוק את הפריט' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        const dialogRef1 = this.dialog.open(SppinerMsgBoxComponent, {
          width: '25rem',
          data: {
            message: `מוחק פריט`
          }
        });

        if (!this.sharedUser) {
          this.superListSrvc.deleteItem(this.id).then(payload => {
            payload.subscribe(data => {
              dialogRef1.close();
              console.log('delete Item data: ', data);
              const snakBarRef = this.snackBar.openFromComponent(
                SnackBarMsgComponent,
                {
                  duration: 2000,
                  data: { msg: 'פריט נמחק בהצלחה' }
                }
              );
            });
          });
        } else {
          this.superListSrvc
            .deleteItemBySharedUser(this.id, this.userId, this.listId)
            .subscribe(payload => {
              payload.then(list => {
                dialogRef1.close();
                console.log('List after delete item by shared user: ', list);
                const snakBarRef = this.snackBar.openFromComponent(
                  SnackBarMsgComponent,
                  {
                    duration: 2000,
                    data: { msg: 'פריט נמחק בהצלחה' }
                  }
                );
              });
            });
        }
      }
    });
  }

  public doneItem() {
    if (!this.sharedUser) {
      this.superListSrvc.setItemDone(this.id);
    } else {
      // סימון הפריט ברשימה משותפת
      // console.log('Shared User: ', this.sharedUser);
      // console.log('Item Number: ', this.id);
      // console.log('User ID: ', this.userId);
      // console.log('List ID: ', this.listId);
      this.superListSrvc.setItemDoneBySharedUser(
        this.id,
        this.userId,
        this.listId
      );
    }
  }

  public updateItem() {
    const updateItem: Item = {
      id: this.id,
      name: this.name,
      amount: this.amount,
      description: this.description,
      cost: this.cost,
      done: this.done,
      measure: this.measure
    };

    const dialogRef = this.dialog.open(UpdateItemComponent, {
      width: '25rem',
      data: {
        item: updateItem,
        sharedUser: this.sharedUser,
        userId: this.userId,
        listId: this.listId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'update') {
        const snakBarRef = this.snackBar.openFromComponent(
          SnackBarMsgComponent,
          {
            duration: 2000,
            data: { msg: 'פריט נשמר בהצלחה' }
          }
        );
      }
    });
  }

  public takePicture() {
    // console.log('Take Picture');
    // console.log('Is Shared User: ', this.sharedUser);

    if (this.sharedUser) {
      // console.log('Item ID: ', this.id);
      // console.log('User ID: ', this.userId);
      // console.log('List ID: ', this.listId);

      this.router.navigate(['camera', this.id, this.userId, this.listId]);
    } else {
      // console.log('Item ID: ', this.id);
      // console.log('User ID: ', this.superListSrvc.getUserID());
      // console.log('List ID: ', this.superListSrvc.getCurentListID());

      this.router.navigate([
        'camera',
        this.id,
        this.superListSrvc.getUserID(),
        this.superListSrvc.getCurentListID()
      ]);
    }
  }

  public onShowBigPictuer() {
    const dealogRef = this.dialog.open(ShowBigPictureComponent, {
      width: '30rem',
      data: {
        imgUrl: this.imgUrl,
        itemName: this.name
      }
    });
  }

  public selectPicture() {
    if (this.sharedUser) {
      // console.log('👨‍💼 User ID: ', this.userId);
      // console.log('List ID: ', this.listId);
      // console.log('Item ID: ', this.id);

      this.router.navigate(['pictureList', this.id, this.userId, this.listId]);
    } else {
      // console.log('👨‍💼 User ID: ', this.superListSrvc.getUserID());
      // console.log('📜 List ID: ', this.superListSrvc.getCurentListID());
      // console.log('📇 Item ID: ', this.id);

      this.router.navigate([
        'pictureList',
        this.id,
        this.superListSrvc.getUserID(),
        this.superListSrvc.getCurentListID()
      ]);
    }
  }
}
