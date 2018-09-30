import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { SuperListService } from './../super-list.service';
import { SuperList } from '../super-list';
import { SnackBarMsgComponent } from './../../messages-box/snack-bar-msg/snack-bar-msg.component';

@Component({
  selector: 'nm-add-new-list',
  templateUrl: './add-new-list.component.html',
  styleUrls: ['./add-new-list.component.scss']
})
export class AddNewListComponent implements OnInit {
  public addNewListForm: FormGroup;
  public isDoneAddingList: boolean;

  constructor(
    private dialogRef: MatDialogRef<AddNewListComponent>,
    private superListService: SuperListService,
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
    this.isDoneAddingList = false;
    // check if list exises befor add list
    this.superListService
      .listExists(this.addNewListForm.value.name)
      .subscribe(data1 => {
        // if length = 0 name dose not exist
        if (data1.length === 0) {
          this.superListService
            .addNewList(
              this.addNewListForm.value.name,
              this.addNewListForm.value.description
            )
            .then(dataObs => {
              dataObs.subscribe((data: SuperList) => {
                this.isDoneAddingList = true;
                this.dialogRef.close('add-new-list');
                this.router.navigate([
                  `/listContainer/${this.addNewListForm.value.name}/${
                    this.addNewListForm.value.description
                  }/${data.id}`
                ]);
              });
            });
        } else {
          // the list name exist
          const snakBarRef = this.snackBar.openFromComponent(
            SnackBarMsgComponent,
            {
              duration: 2000,
              data: { msg: 'קיימת רשימה עם שם זהה' }
            }
          );
        }
      });
  }
}
