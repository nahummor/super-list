import { SnackBarMsgComponent } from './../../messages-box/snack-bar-msg/snack-bar-msg.component';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SuperListService } from './../super-list.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'nm-update-list-detailes',
  templateUrl: './update-list-detailes.component.html',
  styleUrls: ['./update-list-detailes.component.scss']
})
export class UpdateListDetailesComponent implements OnInit {
  public updateListForm: FormGroup;
  public isDoneUpdateList: boolean;

  constructor(
    private superListService: SuperListService,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UpdateListDetailesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.isDoneUpdateList = true;
    this.updateListForm = new FormGroup({
      name: new FormControl(this.data.name, Validators.required),
      description: new FormControl(this.data.description, Validators.required)
    });
  }

  public listUpdate() {
    this.isDoneUpdateList = false;
    this.superListService
      .updateListDetailes(
        this.data.id,
        this.updateListForm.value.name,
        this.updateListForm.value.description
      )
      .then(
        () => {
          this.isDoneUpdateList = true;
          this.dialogRef.close('update');
        },
        error => {
          console.log(error);
        }
      );
  }

  public listUpdate_chack_listName() {
    this.superListService
      .listExists(this.updateListForm.value.name)
      .subscribe(data => {
        if (data.length === 0) {
          this.superListService
            .updateListDetailes(
              this.data.id,
              this.updateListForm.value.name,
              this.updateListForm.value.description
            )
            .then(
              () => {
                // console.log('update list detailes');
                this.dialogRef.close('update');
              },
              error => {
                console.log(error);
              }
            );
        } else {
          // the list name exist
          const snakBarRef = this.snackBar.openFromComponent(
            SnackBarMsgComponent,
            {
              duration: 2000,
              data: { msg: 'קיימת רשימה עם שם זהה' }
            }
          );
        }
      });
  }

  public onClickClose() {
    this.dialogRef.close('close');
  }
}
