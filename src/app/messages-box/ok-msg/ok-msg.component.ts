import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'nm-ok-msg',
  templateUrl: './ok-msg.component.html',
  styleUrls: ['./ok-msg.component.scss']
})
export class OkMsgComponent implements OnInit {
  public message: string;

  constructor(
    public dialogRef: MatDialogRef<OkMsgComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.message = this.data.message;
  }

  public onClickOk(): void {
    this.dialogRef.close('ok');
  }
}
