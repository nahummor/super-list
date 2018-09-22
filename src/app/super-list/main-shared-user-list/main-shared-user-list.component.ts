import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'nm-main-shared-user-list',
  templateUrl: './main-shared-user-list.component.html',
  styleUrls: ['./main-shared-user-list.component.scss']
})
export class MainSharedUserListComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  public onSharedList() {
    this.router.navigate(['sharedMyList']);
  }

  public onGetSharedUsers() {}
}
