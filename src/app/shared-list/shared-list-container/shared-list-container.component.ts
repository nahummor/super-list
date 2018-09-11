import { MatDialog, MatSnackBar } from '@angular/material';
import { AddSharedItemComponent } from './../add-shared-item/add-shared-item.component';
import { SnackBarMsgComponent } from './../../messages-box/snack-bar-msg/snack-bar-msg.component';
import { Subscription } from 'rxjs';
import { SharedListService } from './../shared-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SuperList } from '../../super-list/super-list';

@Component({
  selector: 'nm-shared-list-container',
  templateUrl: './shared-list-container.component.html',
  styleUrls: ['./shared-list-container.component.scss']
})
export class SharedListContainerComponent implements OnInit, OnDestroy {
  public superList: SuperList;
  private listChangeSub: Subscription;

  constructor(
    private sharedListService: SharedListService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.superList = { id: '', name: '', description: '', items: [] };
    this.listChangeSub = this.sharedListService
      .getItemsSharedList(
        this.route.snapshot.params['name'],
        this.route.snapshot.params['description']
      )
      .subscribe(data => {
        // console.log('shared list data: ', data);
        this.superList = {
          id: data[0].id,
          name: data[0].name,
          description: data[0].description,
          items: data[0].items ? data[0].items : []
        };
      });
  }

  ngOnDestroy() {
    this.listChangeSub.unsubscribe();
  }

  public goToList() {
    this.router.navigate(['sharedList/savedList']);
  }

  public addItem() {
    const dialogRef = this.dialog.open(AddSharedItemComponent, {
      data: {
        superList: this.superList
      },
      width: '25rem'
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('resuls: ', result);
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
