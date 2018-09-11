import { UpdateSharedItemComponent } from './../update-shared-item/update-shared-item.component';
import { Item } from './../../super-list/item';
import { SppinerMsgBoxComponent } from './../../messages-box/sppiner-msg-box/sppiner-msg-box.component';
import { YesNoMsgComponent } from './../../messages-box/yes-no-msg/yes-no-msg.component';
import { SnackBarMsgComponent } from './../../messages-box/snack-bar-msg/snack-bar-msg.component';
import { SharedListService } from './../shared-list.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'nm-shared-list-item',
  templateUrl: './shared-list-item.component.html',
  styleUrls: ['./shared-list-item.component.scss']
})
export class SharedListItemComponent implements OnInit {
  @Input()
  listId: string;
  @Input()
  item: Item;

  constructor(
    private sharedSuperListSrvc: SharedListService,
    private dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

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

        this.sharedSuperListSrvc
          .deleteItem(this.listId, this.item)
          .subscribe(data => {
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
      }
    });
  }

  public updateItem() {
    const updateItem: Item = {
      id: this.item.id,
      name: this.item.name,
      amount: this.item.amount,
      description: this.item.description,
      cost: this.item.cost,
      done: false
    };

    const dialogRef = this.dialog.open(UpdateSharedItemComponent, {
      width: '25rem',
      data: { item: updateItem, listId: this.listId }
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
}
