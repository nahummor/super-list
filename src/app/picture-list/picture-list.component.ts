import { Location } from '@angular/common';
import { SuperListService } from './../super-list/super-list.service';
import { Component, OnInit } from '@angular/core';

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

  constructor(
    private superListSrvise: SuperListService,
    private _location: Location
  ) {}

  ngOnInit() {
    this.superListSrvise
      .getUserItemsPictureList()
      .subscribe((list: ItemPicture[]) => {
        this.userPictureList = list;
        console.log(this.userPictureList);
      });
  }

  public onPicSelect() {
    console.log('picture selected...');
  }

  public onGoBack() {
    this._location.back();
  }
}
