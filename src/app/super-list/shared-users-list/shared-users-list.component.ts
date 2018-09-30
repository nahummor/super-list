import { SuperListService } from './../super-list.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { YesNoMsgComponent } from '../../messages-box/yes-no-msg/yes-no-msg.component';
import { SppinerMsgBoxComponent } from '../../messages-box/sppiner-msg-box/sppiner-msg-box.component';

@Component({
  selector: 'nm-shared-users-list',
  templateUrl: './shared-users-list.component.html',
  styleUrls: ['./shared-users-list.component.scss']
})
export class SharedUsersListComponent implements OnInit {
  public isDoneLoading: boolean;
  public authUsers: {
    id: string;
    authorizedUserId: string;
    authorizedUserEmail: string;
  }[];

  constructor(
    private superListService: SuperListService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isDoneLoading = false;
    this.updateAuthUsers();
  }

  public onStopShareList(id: string) {
    const dialogRef = this.dialog.open(YesNoMsgComponent, {
      width: '25rem',
      data: { message: 'האם לבטל את השיתוף' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        const dialogRef1 = this.dialog.open(SppinerMsgBoxComponent, {
          width: '25rem',
          data: { message: 'מבטל שיתוף' }
        });
        this.superListService.delSharedUser(id).then(() => {
          this.updateAuthUsers();
          dialogRef1.close();
        });
      }
    });
  }

  private updateAuthUsers() {
    this.superListService.getMySharedUsers().subscribe(data => {
      console.log('Shared Users: ', data);
      this.authUsers = data;
      this.isDoneLoading = true;
    });
  }
}
