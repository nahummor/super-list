import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Item } from './../item';
import { SuperListService } from './../super-list.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'nm-update-item',
  templateUrl: './update-item.component.html',
  styleUrls: ['./update-item.component.scss']
})
export class UpdateItemComponent implements OnInit {
  public updateItem: Item;
  public updateItemForm: FormGroup;
  public measureList: { id: string; name: string }[];

  constructor(
    public dialogRef: MatDialogRef<UpdateItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public superListSrvs: SuperListService
  ) {}

  ngOnInit() {
    this.updateItem = this.data.item;
    // console.log('Item: ', this.updateItem);
    this.updateItemForm = new FormGroup({
      id: new FormControl(this.updateItem.id),
      name: new FormControl(this.updateItem.name, Validators.required),
      description: new FormControl(this.updateItem.description),
      amount: new FormControl(this.updateItem.amount, Validators.required),
      measure: new FormControl(this.updateItem.measure, Validators.required),
      cost: new FormControl(this.updateItem.cost, Validators.required)
    });

    this.superListSrvs.getMeasureList().subscribe(list => {
      this.measureList = list;
      // console.log('Measure list: ', this.measureList);
    });
  }

  public onUpdateItem() {
    const item: Item = {
      id: this.updateItemForm.value.id,
      name: this.updateItemForm.value.name,
      description: this.updateItemForm.value.description,
      amount: this.updateItemForm.value.amount,
      measure: this.updateItemForm.value.measure,
      cost: Number.parseFloat(this.updateItemForm.value.cost)
    };

    if (!this.data.sharedUser) {
      this.superListSrvs.updateItem(item);
    } else {
      // עדכון פריט ברשימה משותפת
      this.superListSrvs.updateItemBySharedUser(
        this.data.userId,
        this.data.listId,
        item
      );
    }

    this.dialogRef.close('update');
  }

  public onClickClose() {
    this.dialogRef.close('close');
  }
}
