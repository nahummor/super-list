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
    this.superListSrvs
      .addItem(this.data.superList, this.addItemForm.value)
      .subscribe(data => {
        this.isDoneAddingItem = true;
        this.dialogRef.close('add item');
      });
  }

  public onClickClose() {
    this.dialogRef.close('close');
  }
}
