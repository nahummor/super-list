import { SnackBarMsgComponent } from './../../messages-box/snack-bar-msg/snack-bar-msg.component';
import { SharedListService } from './../shared-list.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'nm-update-shared-list-detailes',
  templateUrl: './update-shared-list-detailes.component.html',
  styleUrls: ['./update-shared-list-detailes.component.scss']
})
export class UpdateSharedListDetailesComponent implements OnInit {
  public updateListForm: FormGroup;
  public isDoneUpdateList: boolean;

  constructor(
    private sharedListService: SharedListService,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UpdateSharedListDetailesComponent>,
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
    this.sharedListService
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
          console.error(error);
        }
      );
  }

  public onClickClose() {
    this.dialogRef.close('close');
  }
}
