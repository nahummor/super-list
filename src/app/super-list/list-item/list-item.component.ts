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
  done: boolean;
  @Input()
  opButton: boolean;
  @Input()
  sharedUser: boolean;
  @Input()
  userId: string;
  @Input()
  listId: string;
  public checked: boolean;
  public imgUrl: string;

  constructor(
    private router: Router,
    private superListSrvc: SuperListService,
    private dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.imgUrl = `https://firebasestorage.googleapis.com/v0/b/superlist-80690.appspot.com/o/users-pictures%2Fpic-2018-10-07T17%3A39%3A27.090Z.jpg?alt=media&token=29af9f45-3d08-4ae2-b50f-6e181060209d`;
    this.checked = this.done;
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
      done: this.done
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
    console.log('Take Picture 📷');
    this.router.navigate(['camera']);
  }
}
