import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nm-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  public imgUrl: string;

  constructor() {}

  ngOnInit() {
    this.imgUrl = 'assets/img/superList.PNG';
  }
}
