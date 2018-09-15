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
  public checked: boolean;

  constructor(
    private superListSrvc: SuperListService,
    private dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
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

        this.superListSrvc.deleteItem(this.id).subscribe(data => {
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

  public doneItem() {
    console.log('done item!...', this.id);
    this.superListSrvc.setItemDone(this.id);
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
      data: { item: updateItem }
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