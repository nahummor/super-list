import { SuperListService } from './../super-list.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SuperList } from '../super-list';
import { Subscription } from 'rxjs';

@Component({
  selector: 'nm-show-shared-user-list',
  templateUrl: './show-shared-user-list.component.html',
  styleUrls: ['./show-shared-user-list.component.scss']
})
export class ShowSharedUserListComponent implements OnInit, OnDestroy {
  public userEmail: string;
  public userLists: SuperList[] = [];
  public isDoneLoading: boolean;
  private userId: string;
  private userListSub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private superListService: SuperListService
  ) {}

  ngOnInit() {
    this.isDoneLoading = false;
    this.route.params.subscribe((params: Params) => {
      this.userEmail = params['userEmail'];
      this.userId = params['userId'];
      // console.log(params['userId']);
      // console.log(params['userEmail']);
      this.userListSub = this.superListService
        .getUserListsByUserId(params['userId'])
        .subscribe(userLists => {
          this.userLists = userLists;
          this.isDoneLoading = true;
          // console.table(this.userLists);
        });
    });
  }

  ngOnDestroy() {
    this.userListSub.unsubscribe();
  }

  public showList(list: SuperList) {
    // console.log(list);
    // console.table(list.items);
    this.router.navigate([
      'showSharedUserListCon',
      this.userId,
      list.id,
      this.userEmail
    ]);
  }
}
