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

  constructor(
    public dialogRef: MatDialogRef<UpdateItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public superListSrvs: SuperListService
  ) {}

  ngOnInit() {
    this.updateItem = this.data.item;
    this.updateItemForm = new FormGroup({
      id: new FormControl(this.updateItem.id),
      name: new FormControl(this.updateItem.name, Validators.required),
      description: new FormControl(
        this.updateItem.description,
        Validators.required
      ),
      amount: new FormControl(this.updateItem.amount, Validators.required),
      cost: new FormControl(this.updateItem.cost, Validators.required)
    });
  }

  public onUpdateItem() {
    this.superListSrvs.updateItem(this.updateItemForm.value);
    this.dialogRef.close('update');
  }
  public onClickClose() {
    this.dialogRef.close('close');
  }
}
