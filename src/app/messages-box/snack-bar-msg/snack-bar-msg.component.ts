import { MAT_SNACK_BAR_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'nm-snack-bar-msg',
  templateUrl: './snack-bar-msg.component.html',
  styleUrls: ['./snack-bar-msg.component.scss']
})
export class SnackBarMsgComponent implements OnInit {
  public message: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

  ngOnInit() {
    this.message = this.data.msg;
  }
}
