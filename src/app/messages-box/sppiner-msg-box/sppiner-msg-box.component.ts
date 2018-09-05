import { MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'nm-sppiner-msg-box',
  templateUrl: './sppiner-msg-box.component.html',
  styleUrls: ['./sppiner-msg-box.component.scss']
})
export class SppinerMsgBoxComponent implements OnInit {
  public message: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.message = this.data.message;
  }
}
