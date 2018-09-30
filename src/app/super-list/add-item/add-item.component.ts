import { User } from './../../auth/user';
import { SuperListService } from './../super-list.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'nm-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
  public addItemForm: FormGroup;
  public isDoneAddingItem: boolean;

  constructor(
    public dialogRef: MatDialogRef<AddItemComponent>,
    private superListSrvs: SuperListService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.isDoneAddingItem = true;
    this.addItemForm = new FormGroup({
      id: new FormControl(0),
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      cost: new FormControl(0)
    });
  }

  public addItem() {
    this.isDoneAddingItem = false;
    if (!this.data.sharedUser) {
      // מוסיף הפריט הוא הבעלים של הרשימה
      this.superListSrvs
        .addItem(this.data.superList, this.addItemForm.value)
        .then(payload => {
          payload.subscribe(data => {
            this.isDoneAddingItem = true;
            this.dialogRef.close('add item');
          });
        });
    } else {
      // מוסיף הפריט הוא משתמש שקיבל שיתוף לרשימה
      // console.log(this.data.userId);
      // console.log(this.data.list);
      this.superListSrvs
        .addItemToSharedList(
          this.data.userId,
          this.data.list,
          this.addItemForm.value
        )
        .then(() => {
          this.isDoneAddingItem = true;
          this.dialogRef.close('add item');
        });
    }
  }

  public onClickClose() {
    this.dialogRef.close('close');
  }
}
