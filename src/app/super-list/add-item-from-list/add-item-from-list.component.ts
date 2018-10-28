import { SharedListService } from './../../shared-list/shared-list.service';
import { Component, OnInit } from '@angular/core';
import { Item } from '../item';

@Component({
  selector: 'nm-add-item-from-list',
  templateUrl: './add-item-from-list.component.html',
  styleUrls: ['./add-item-from-list.component.scss']
})
export class AddItemFromListComponent implements OnInit {
  public items: Item[];
  public filterTxt: string;

  constructor(private sharedListService: SharedListService) {}

  ngOnInit() {
    this.sharedListService.getAllSharedItems().subscribe(items => {
      this.items = items;
      this.items.sort((i1: Item, i2: Item) => {
        if (i1.name > i2.name) {
          return 1;
        }
        return -1;
      });
    });
  }

  public addItem() {
    console.log('Add item');
  }
}
