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

  constructor(
    public dialogRef: MatDialogRef<UpdateSharedItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sharedListSrvs: SharedListService
  ) {}

  ngOnInit() {
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
      cost: new FormControl(this.updateItem.cost, Validators.required),
      done: new FormControl(false)
    });
  }

  public onUpdateItem() {
    const oldItem: Item = {
      id: this.data.item.id,
      amount: Number.parseInt(this.data.item.amount),
      cost: Number.parseInt(this.data.item.cost),
      description: this.data.item.description,
      done: false,
      name: this.data.item.name
    };
    const newItem: Item = {
      id: this.updateItemForm.value.id,
      amount: Number.parseInt(this.updateItemForm.value.amount),
      cost: Number.parseInt(this.updateItemForm.value.cost),
      description: this.updateItemForm.value.description,
      done: this.updateItemForm.value.done,
      name: this.updateItemForm.value.name
    };

    this.sharedListSrvs
      .updateItem(this.listId, newItem, oldItem)
      .subscribe(data => {
        console.log('Update shared item: ', data);
        this.dialogRef.close('update');
      });
    // this.sharedListSrvs
    //   .updateItemV2(this.listId, newItem, oldItem)
    //   .subscribe(data => {
    //     console.log('Update shared item: ', data);
    //     this.dialogRef.close('update');
    //   });
  }
  public onClickClose() {
    this.dialogRef.close('close');
  }
}
