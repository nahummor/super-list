import { SnackBarMsgComponent } from './../../messages-box/snack-bar-msg/snack-bar-msg.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SuperListService } from './../super-list.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SuperList } from '../super-list';
import { YesNoMsgComponent } from '../../messages-box/yes-no-msg/yes-no-msg.component';
import { SppinerMsgBoxComponent } from '../../messages-box/sppiner-msg-box/sppiner-msg-box.component';

@Component({
  selector: 'nm-shared-list-container',
  templateUrl: './shared-list-container.component.html',
  styleUrls: ['./shared-list-container.component.scss']
})
export class SharedListContainerComponent implements OnInit {
  public list: SuperList;

  constructor(
    private superListService: SuperListService,
    private router: Router,
    private dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.list = this.superListService.getSharedList();
  }

  public goToList() {
    this.router.navigate(['savedSharedList']);
  }

  public onAddList() {
    const dialogRef = this.dialog.open(YesNoMsgComponent, {
      width: '25rem',
      data: { message: 'האם להוסיף את הרשימה' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        const dialogRef2 = this.dialog.open(SppinerMsgBoxComponent, {
          width: '25rem',
          data: {
            message: `מוסיף רשימה`
          }
        });
        this.superListService.addSharedListToMyList().then(payload => {
          payload.subscribe((superList: SuperList) => {
            dialogRef2.close();
            const snakBarRef = this.snackBar.openFromComponent(
              SnackBarMsgComponent,
              {
                duration: 2000,
                data: { msg: 'הרשימה נוספה בהצלחה' }
              }
            );
          });
        });
      }
    });
  }
}
