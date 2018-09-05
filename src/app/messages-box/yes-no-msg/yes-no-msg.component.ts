import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'nm-yes-no-msg',
  templateUrl: './yes-no-msg.component.html',
  styleUrls: ['./yes-no-msg.component.scss']
})
export class YesNoMsgComponent implements OnInit {
  public message: string;

  constructor(
    public dialogRef: MatDialogRef<YesNoMsgComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.message = this.data.message;
  }

  public onClickYes(): void {
    this.dialogRef.close('yes');
  }

  public onClickNo(): void {
    this.dialogRef.close('no');
  }
}
