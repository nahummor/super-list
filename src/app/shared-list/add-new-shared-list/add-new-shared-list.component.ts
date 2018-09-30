import { Router } from '@angular/router';
import { AddNewListComponent } from './../../super-list/add-new-list/add-new-list.component';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SharedListService } from '../shared-list.service';
import { SuperList } from '../../super-list/super-list';

@Component({
  selector: 'nm-add-new-shared-list',
  templateUrl: './add-new-shared-list.component.html',
  styleUrls: ['./add-new-shared-list.component.scss']
})
export class AddNewSharedListComponent implements OnInit {
  public addNewListForm: FormGroup;
  public isDoneAddingList: boolean;

  constructor(
    private dialogRef: MatDialogRef<AddNewListComponent>,
    private sharedListService: SharedListService,
    private router: Router,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.isDoneAddingList = true;
    this.addNewListForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });
  }

  public onCancel() {
    this.dialogRef.close('close');
  }

  public onAddNewList() {
    console.log('add new list: ');
    this.isDoneAddingList = false;
    this.sharedListService
      .addNewSharedList(
        this.addNewListForm.value.name,
        this.addNewListForm.value.description
      )
      .then(payload => {
        payload.subscribe((data: SuperList) => {
          this.isDoneAddingList = true;
          this.dialogRef.close('add-new-shared-list');
          console.log('add new shared list: ', data);
          this.router.navigate([
            'sharedList/listContainer',
            data.name,
            data.description
          ]);
        });
      });
  }
}
