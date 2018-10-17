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
  public measureList: { id: string; name: string }[];

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
      amount: new FormControl('1', Validators.required),
      cost: new FormControl(0),
      pictureUrl: new FormControl(''),
      measure: new FormControl('', Validators.required)
    });

    this.superListSrvs.getMeasureList().subscribe(list => {
      this.measureList = list;
      // console.log('Measure list: ', this.measureList);
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
