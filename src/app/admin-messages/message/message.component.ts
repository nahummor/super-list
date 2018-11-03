import { MessageService } from './../message.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nm-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  public messages: any[];

  constructor(private msgService: MessageService) {}

  ngOnInit() {
    this.msgService.getMessagesList().subscribe(messages => {
      console.log(messages);
      this.messages = messages;
    });
  }
}
