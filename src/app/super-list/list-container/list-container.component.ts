import { AddItemComponent } from './../add-item/add-item.component';
import { SnackBarMsgComponent } from './../../messages-box/snack-bar-msg/snack-bar-msg.component';
import { SuperListService, ItemUpdate } from './../super-list.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SuperList } from '../super-list';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'nm-list-container',
  templateUrl: './list-container.component.html',
  styleUrls: ['./list-container.component.scss']
})
export class ListContainerComponent implements OnInit, OnDestroy {
  public superList: SuperList;
  private listChangeSub: Subscription;
  public itemNotSelected: number;
  private userUpdateItemChangeSub: Subscription;
  public updateItemId: number;
  public updateItemIdArray = new Array<number>();

  constructor(
    private dialog: MatDialog,
    private superListSrvs: SuperListService,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.superList = { id: '', name: '', description: '', items: [] };
    this.listChangeSub = this.superListSrvs
      .getItemsList(
        this.route.snapshot.params['name'],
        this.route.snapshot.params['id']
      )
      .subscribe(
        data => {
          // console.log('*** My List ***');
          // console.log('data: ', data);
          this.superList = {
            id: data.id,
            name: data.name,
            description: data.description,
            items: data.items ? data.items : []
          };
          this.superListSrvs.setSuperList(this.superList);
          this.itemNotSelected = 0;
          this.countNotSelectedItems();
          this.superList.items.forEach(item => {
            this.updateItemIdArray.push(-1);
          });
        },
        error => {
          console.log(error);
        }
      );

    this.userUpdateItemChangeSub = this.superListSrvs.userUpdateItemEvent.subscribe(
      (data: ItemUpdate) => {
        console.log('item ID: ', data.itemId);
        console.log('item name: ', data.itemName);
        console.log('list name: ', data.listName);
        console.log('super list name: ', this.superList.name);

        if (this.superList.name === data.listName) {
          this.updateItemIdArray[data.itemId] = data.itemId;
          this.updateItemId = data.itemId;
        } else {
          this.updateItemId = -1;
        }
      }
    );
  }

  ngOnDestroy() {
    this.listChangeSub.unsubscribe();
    this.userUpdateItemChangeSub.unsubscribe();
  }

  private countNotSelectedItems() {
    this.superList.items.forEach(item => {
      if (!item.done) {
        this.itemNotSelected++;
      }
    });
  }

  public resetAllItems() {
    this.superListSrvs.resetAllItems();
  }

  public goToList() {
    this.router.navigate(['savedList']);
  }

  public addItem() {
    const dialogRef = this.dialog.open(AddItemComponent, {
      data: {
        superList: this.superList
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
}
