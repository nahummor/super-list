import { Location } from '@angular/common';
import { SnackBarMsgComponent } from './../../messages-box/snack-bar-msg/snack-bar-msg.component';
import { SppinerMsgBoxComponent } from './../../messages-box/sppiner-msg-box/sppiner-msg-box.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SuperListService } from './../super-list.service';
import { SharedListService } from './../../shared-list/shared-list.service';
import { Component, OnInit } from '@angular/core';
import { Item } from '../item';

@Component({
  selector: 'nm-add-item-from-list',
  templateUrl: './add-item-from-list.component.html',
  styleUrls: ['./add-item-from-list.component.scss']
})
export class AddItemFromListComponent implements OnInit {
  public items: Item[];
  public filterTxt: string;
  public isDoneLoadingItems: boolean;

  constructor(
    private _location: Location,
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    private sharedListService: SharedListService,
    private superListService: SuperListService
  ) {}

  ngOnInit() {
    this.isDoneLoadingItems = false;
    this.sharedListService.getAllSharedItems().subscribe(items => {
      this.items = items;
      this.items.sort((i1: Item, i2: Item) => {
        if (i1.name > i2.name) {
          return 1;
        }
        return -1;
      });
      this.isDoneLoadingItems = true;
      this.filterTxt = '';
    });
  }

  public addItem(item: Item) {
    const dialogRef = this.dialog.open(SppinerMsgBoxComponent, {
      width: '25rem',
      data: {
        message: `מוסיפ פריט לרשימה`
      }
    });

    this.superListService
      .addItem(this.superListService.getSuperList(), item)
      .then(payload => {
        payload.subscribe(data => {
          // console.log('Data: ', data);
          dialogRef.close();
          const snakBarRef = this.snackBar.openFromComponent(
            SnackBarMsgComponent,
            {
              duration: 2000,
              data: { msg: 'פריט חדש נקלט בהצלחה' }
            }
          );
        });
      });
  }

  public goToBack() {
    this._location.back();
  }
}
