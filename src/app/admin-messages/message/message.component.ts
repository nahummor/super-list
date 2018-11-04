import { MatDialogRef } from '@angular/material';
import { MessageService } from './../message.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nm-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  public messages: any[];
  public isDoneLoadingMessages: boolean;

  constructor(
    private msgService: MessageService,
    public dialogRef: MatDialogRef<MessageComponent>
  ) {}

  ngOnInit() {
    this.isDoneLoadingMessages = false;
    this.msgService.getMessagesList().subscribe(messages => {
      console.log(messages);
      this.messages = messages;
      this.isDoneLoadingMessages = true;
    });
  }

  public onClose() {
    this.dialogRef.close('close');
  }
}
