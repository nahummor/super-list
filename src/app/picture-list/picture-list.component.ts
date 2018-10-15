import { MatDialog } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { SuperListService } from './../super-list/super-list.service';
import { Component, OnInit } from '@angular/core';
import { OkMsgComponent } from '../messages-box/ok-msg/ok-msg.component';

interface ItemPicture {
  id: string;
  itemName: string;
  picUrl: string;
}

@Component({
  selector: 'nm-picture-list',
  templateUrl: './picture-list.component.html',
  styleUrls: ['./picture-list.component.scss']
})
export class PictureListComponent implements OnInit {
  public userPictureList: ItemPicture[];
  private itemId: number;
  private userId: string;
  private listId: string;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private superListSrvise: SuperListService,
    private _location: Location
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.itemId = Number.parseInt(params['itemId']);
      this.userId = params['userId'];
      this.listId = params['listId'];
    });

    this.superListSrvise
      .getUserItemsPictureList()
      .subscribe((list: ItemPicture[]) => {
        this.userPictureList = list;
        console.log(this.userPictureList);
      });
  }

  public onPicSelect(picUrl: string) {
    // console.log('picture selected...');
    // console.log('👨‍ User ID: ', this.userId);
    // console.log('📜 List ID: ', this.listId);
    // console.log('📇 Item ID: ', this.itemId);
    // console.log('Pic Url: ', picUrl);
    this.superListSrvise
      .updateItemPictureUrlFromPictureList(
        picUrl,
        this.itemId,
        this.userId,
        this.listId
      )
      .then(
        () => {
          const dialogRef = this.dialog.open(OkMsgComponent, {
            width: '25rem',
            data: { message: 'הפריט עודכן בהצלחה' }
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result === 'ok') {
              this._location.back();
            }
          });
        },
        error => {
          console.log('Error: ', error);
        }
      );
  }

  public onGoBack() {
    this._location.back();
  }
}
