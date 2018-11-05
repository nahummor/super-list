import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'nm-show-big-picture',
  templateUrl: './show-big-picture.component.html',
  styleUrls: ['./show-big-picture.component.scss']
})
export class ShowBigPictureComponent implements OnInit {
  public imgUrl: string;
  public itemName: string;
  public loadingGifUrl: string;
  public doneLoadingPicture: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ShowBigPictureComponent>
  ) {}

  ngOnInit() {
    this.doneLoadingPicture = false;
    this.loadingGifUrl = 'assets/img/loading.gif';
    this.imgUrl = this.data.imgUrl;
    this.itemName = this.data.itemName;
  }

  public onDoneLoadingPicture() {
    this.doneLoadingPicture = true;
  }

  public onClose() {
    this.dialogRef.close('close');
  }
}
