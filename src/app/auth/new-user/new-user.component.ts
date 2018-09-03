import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'nm-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  public addUserForm: FormGroup;

  constructor() {}

  ngOnInit() {
    this.addUserForm = new FormGroup({
      userName: new FormControl('', [Validators.required, Validators.email])
    });
  }
}
