import { SuperListService } from './../super-list.service';
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
  public isDoneLoadingItems: boolean;

  constructor(
    private sharedListService: SharedListService,
    private superListService: SuperListService
  ) {}

  ngOnInit() {
    this.isDoneLoadingItems = false;
    this.sharedListService.getAllSharedItems().subscribe(items => {
      this.items = items;
      this.items.sort((i1: Item, i2: Item) => {
        if (i1.name > i2.name) {
          return 1;
        }
        return -1;
      });
      this.isDoneLoadingItems = true;
      this.filterTxt = '';
    });
  }

  public addItem(item: Item) {
    this.superListService
      .addItem(this.superListService.getSuperList(), item)
      .then(payload => {
        payload.subscribe(data => {
          console.log('Add item: ', item);
        });
      });
  }
}
