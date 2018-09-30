import { SnackBarMsgComponent } from './../../messages-box/snack-bar-msg/snack-bar-msg.component';
import { AddItemComponent } from './../add-item/add-item.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SuperListService } from './../super-list.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SuperList } from '../super-list';
import { Subscription } from 'rxjs';

@Component({
  selector: 'nm-show-shared-user-list-container',
  templateUrl: './show-shared-user-list-con.component.html',
  styleUrls: ['./show-shared-user-list-con.component.scss']
})
export class ShowSharedUserListConComponent implements OnInit, OnDestroy {
  private userId: string;
  public userEmail: string;
  private listId: string;
  public itemNotSelected: number;
  public listSum: number;
  public superList: SuperList;
  public updateItemIdArray = new Array<number>();
  private userListSub: Subscription;

  constructor(
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private superListService: SuperListService
  ) {}

  ngOnInit() {
    this.superList = { id: '', name: '', description: '', items: [] };
    this.route.params.subscribe((params: Params) => {
      this.userId = params['userId'];
      this.listId = params['listId'];
      this.userEmail = params['userEmail'];

      this.listSum = 0;

      this.userListSub = this.superListService
        .getUserList(this.userId, this.listId)
        .subscribe(list => {
          this.superList = list;
          this.itemNotSelected = 0;
          this.countNotSelectedItems();
        });
    });
  }

  ngOnDestroy() {
    this.userListSub.unsubscribe();
  }

  private countNotSelectedItems() {
    this.superList.items.forEach(item => {
      if (!item.done) {
        this.itemNotSelected++;
      }
      this.listSum = this.listSum + item.cost; // calc sum items cost
      this.updateItemIdArray.push(-1);
    });
  }

  public addItem() {
    const dialogRef = this.dialog.open(AddItemComponent, {
      data: {
        superList: this.superList,
        sharedUser: true, // האם מי שמוסיף את הפריט הוא משתמש שקיבל שיתוף או שהוא הבעלים של הרשימה
        userId: this.userId,
        list: this.superList
      },
      width: '25rem'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('resuls: ', result);
      if (result === 'add item') {
        const snakBarRef = this.snackBar.openFromComponent(
          SnackBarMsgComponent,
          {
            duration: 2000,
            data: { msg: 'פריט חדש נקלט בהצלחה' }
          }
        );
      }
    });
  }

  public resetListItems() {
    this.superList.items.forEach(item => {
      item.done = false;
    });
    this.superListService.resetListItems(
      this.userId,
      this.listId,
      this.superList.items
    );
  }

  public goToList() {
    this.router.navigate(['showSharedUserList', this.userId, this.userEmail]);
  }
}
