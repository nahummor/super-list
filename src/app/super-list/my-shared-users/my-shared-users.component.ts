import { Router } from '@angular/router';
import { SuperListService } from './../super-list.service';
import { Component, OnInit } from '@angular/core';

// הצגה של משתמשים שאני יכול לראות את רשימות שלהם
@Component({
  selector: 'nm-my-shared-users',
  templateUrl: './my-shared-users.component.html',
  styleUrls: ['./my-shared-users.component.scss']
})
export class MySharedUsersComponent implements OnInit {
  public isDoneLoading: boolean;
  public usersList: { userId: string; userEmail: string }[] = [];

  constructor(
    private superListService: SuperListService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isDoneLoading = false;
    this.superListService.getUsersSharedWithMe().subscribe(usersList => {
      this.usersList = usersList;
      this.isDoneLoading = true;
    });
  }

  public onShowUserList(userEmail: string, userId: string) {
    this.router.navigate(['showSharedUserList', userId, userEmail]);
  }
}
