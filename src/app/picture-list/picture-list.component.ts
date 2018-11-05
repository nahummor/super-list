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
  // public doneLoadingPicture: boolean;
  public loadingGifUrl: string;
  public doneLoadingPictureArr: boolean[];

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private superListSrvise: SuperListService,
    private _location: Location
  ) {}

  ngOnInit() {
    // this.doneLoadingPicture = false;
    this.loadingGifUrl = 'assets/img/loading.gif';

    this.route.params.subscribe((params: Params) => {
      this.itemId = Number.parseInt(params['itemId'], 10);
      this.userId = params['userId'];
      this.listId = params['listId'];
    });

    this.superListSrvise
      .getUserItemsPictureList()
      .subscribe((list: ItemPicture[]) => {
        list.sort((item1, item2) => {
          if (item1.itemName < item2.itemName) {
            return -1;
          }
          if (item1.itemName > item2.itemName) {
            return 1;
          }
          // names must be equal
          return 0;
        });
        this.userPictureList = list;
        this.doneLoadingPictureArr = new Array(this.userPictureList.length);
        this.doneLoadingPictureArr.fill(false);
        // console.log(this.userPictureList);
      });
  }

  public onDoneLoadingPicture(i: number) {
    // this.doneLoadingPicture = true;
    this.doneLoadingPictureArr[i] = true;
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
