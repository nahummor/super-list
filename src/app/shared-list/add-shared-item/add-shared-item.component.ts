import { SharedListService } from './../shared-list.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { ErrorMsgComponent } from '../../messages-box/error-msg/error-msg.component';

@Component({
  selector: 'nm-add-shared-item',
  templateUrl: './add-shared-item.component.html',
  styleUrls: ['./add-shared-item.component.scss']
})
export class AddSharedItemComponent implements OnInit {
  public addItemForm: FormGroup;
  public isDoneAddingItem: boolean;
  public measureList: { id: string; name: string }[];

  constructor(
    private errSnackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddSharedItemComponent>,
    private sharedListService: SharedListService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.isDoneAddingItem = true;
    this.addItemForm = new FormGroup({
      id: new FormControl(0),
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      cost: new FormControl(0),
      done: new FormControl(false),
      measure: new FormControl('', Validators.required)
    });

    this.sharedListService.getMeasureList().subscribe(list => {
      this.measureList = list;
      // console.log('Measure list: ', this.measureList);
    });
  }

  public addItem() {
    this.isDoneAddingItem = false;
    this.sharedListService
      .addItem(this.data.superList, this.addItemForm.value)
      .then(payload => {
        payload.subscribe(
          data => {
            this.isDoneAddingItem = true;
            this.dialogRef.close('add item');
          },
          error => {
            this.isDoneAddingItem = true;
            const snackBarRef = this.errSnackBar.openFromComponent(
              ErrorMsgComponent,
              {
                data: { message: 'פריט לא נקלט יש לקלוט שוב' },
                duration: 4000,
                verticalPosition: 'bottom',
                horizontalPosition: 'center',
                direction: 'rtl',
                panelClass: ['my-snack-bar']
              }
            );
          }
        );
      });
  }

  public onClickClose() {
    this.dialogRef.close('close');
  }
}
