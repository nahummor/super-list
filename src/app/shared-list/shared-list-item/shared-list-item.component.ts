import { SharedListService } from './../shared-list.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'nm-shared-list-item',
  templateUrl: './shared-list-item.component.html',
  styleUrls: ['./shared-list-item.component.scss']
})
export class SharedListItemComponent implements OnInit {
  @Input()
  id: number;
  @Input()
  name: string;
  @Input()
  amount: number;
  @Input()
  description: string;
  @Input()
  cost: number;
  constructor(
    private sharedSuperListSrvc: SharedListService,
    private dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  public deleteItem() {}

  public updateItem() {}
}
