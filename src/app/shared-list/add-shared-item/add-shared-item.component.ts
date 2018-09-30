import { SharedListService } from './../shared-list.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'nm-add-shared-item',
  templateUrl: './add-shared-item.component.html',
  styleUrls: ['./add-shared-item.component.scss']
})
export class AddSharedItemComponent implements OnInit {
  public addItemForm: FormGroup;
  public isDoneAddingItem: boolean;

  constructor(
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
      done: new FormControl(false)
    });
  }

  public addItem() {
    this.isDoneAddingItem = false;
    this.sharedListService
      .addItem(this.data.superList, this.addItemForm.value)
      .then(payload => {
        payload.subscribe(data => {
          this.isDoneAddingItem = true;
          this.dialogRef.close('add item');
        });
      });
  }

  public onClickClose() {
    this.dialogRef.close('close');
  }
}
