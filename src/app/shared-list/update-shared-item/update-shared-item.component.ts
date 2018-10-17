import { SharedListService } from './../shared-list.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Item } from './../../super-list/item';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'nm-update-shared-item',
  templateUrl: './update-shared-item.component.html',
  styleUrls: ['./update-shared-item.component.scss']
})
export class UpdateSharedItemComponent implements OnInit {
  private updateItem: Item;
  public updateItemForm: FormGroup;
  private listId: string;
  public isDoneUpdateItem: boolean;
  public measureList: { id: string; name: string }[];

  constructor(
    public dialogRef: MatDialogRef<UpdateSharedItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sharedListSrvs: SharedListService
  ) {}

  ngOnInit() {
    this.isDoneUpdateItem = true;
    this.updateItem = this.data.item;
    this.listId = this.data.listId;

    this.updateItemForm = new FormGroup({
      id: new FormControl(this.updateItem.id),
      name: new FormControl(this.updateItem.name, Validators.required),
      description: new FormControl(
        this.updateItem.description,
        Validators.required
      ),
      amount: new FormControl(this.updateItem.amount, Validators.required),
      measure: new FormControl(this.updateItem.measure, Validators.required),
      cost: new FormControl(this.updateItem.cost, Validators.required),
      done: new FormControl(false)
    });

    this.sharedListSrvs.getMeasureList().subscribe(list => {
      this.measureList = list;
      // console.log('Measure list: ', this.measureList);
    });
  }

  public onUpdateItem() {
    this.isDoneUpdateItem = false;
    const oldItem: Item = {
      id: this.data.item.id,
      amount: Number.parseFloat(this.data.item.amount),
      cost: Number.parseFloat(this.data.item.cost),
      description: this.data.item.description,
      measure: this.updateItemForm.value.measure,
      done: false,
      name: this.data.item.name
    };
    const newItem: Item = {
      id: this.updateItemForm.value.id,
      amount: Number.parseFloat(this.updateItemForm.value.amount),
      cost: Number.parseFloat(this.updateItemForm.value.cost),
      description: this.updateItemForm.value.description,
      measure: this.updateItemForm.value.measure,
      done: this.updateItemForm.value.done,
      name: this.updateItemForm.value.name
    };

    this.sharedListSrvs
      .updateItem(this.listId, newItem, oldItem)
      .then(payload => {
        payload.subscribe(data => {
          // console.log('Update shared item: ', data);
          this.isDoneUpdateItem = true;
          this.dialogRef.close('update');
        });
      });
  }

  public onClickClose() {
    this.dialogRef.close('close');
  }
}
