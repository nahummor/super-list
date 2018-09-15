import { SppinerMsgBoxComponent } from './../messages-box/sppiner-msg-box/sppiner-msg-box.component';
import { OkMsgComponent } from './../messages-box/ok-msg/ok-msg.component';
import { Item } from './item';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { AuthService } from './../auth/auth.service';
import { SuperList } from './super-list';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFirestore } from 'angularfire2/firestore';

export interface ItemUpdate {
  itemUpdateId: string;
  itemId: number;
  itemName: string;
  listName: string;
}

@Injectable({
  providedIn: 'root'
})
export class SuperListService {
  private superList: SuperList;
  private sharedList: SuperList;
  private uid: string;
  private itemUpdate: ItemUpdate;
  private userUpdateItem: boolean;
  private token: string;
  public userUpdateItemEvent = new EventEmitter<ItemUpdate>();
  private itemUpdateSub: Subscription;

  constructor(
    private httpClient: HttpClient,
    private db: AngularFirestore,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.uid = this.authService.getUserId();
    this.userUpdateItem = false;
    this.getItemUpdate();
    this.token = this.authService.getToken();
  }

  public unSubscription() {
    this.itemUpdateSub.unsubscribe();
  }

  public setUserId() {
    this.uid = this.authService.getUserId();
    this.superList = null; // איפוס רשימה לאחר החלפת משתמש
  }

  public getItemUpdate() {
    this.itemUpdateSub = this.db
      .collection('super-list')
      .doc(this.uid)
      .collection('item-update')
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => {
            this.itemUpdate = {
              itemUpdateId: doc.payload.doc.id,
              itemId: doc.payload.doc.data().itemId,
              itemName: doc.payload.doc.data().itemName,
              listName: doc.payload.doc.data().listName
            };
            return this.itemUpdate;
          });
        })
      )
      .subscribe(
        data => {
          if (!this.getUserUpdateItem()) {
            if (data.length > 0) {
              if (data[0].itemId > -1) {
                this.userUpdateItemEvent.emit(data[0]);
                const dialogRef = this.dialog.open(OkMsgComponent, {
                  width: '25rem',
                  data: {
                    message: `ברשימה ${data[0].listName} עודכן הפריט ${
                      data[0].itemName
                    }`
                  }
                });
                dialogRef.afterClosed().subscribe(result => {
                  console.log('ans: ', result);
                  this.setUserUpdateItem(false);
                  this.setItemUpdate(-1, '', '');
                });
              }
            }
          } else {
            this.setUserUpdateItem(false);
          }
        },
        error => {
          this.itemUpdateSub.unsubscribe();
        }
      );
  }

  // set the item was updated
  private setItemUpdate(itemId: number, itemName: string, listName: string) {
    this.db
      .collection('super-list')
      .doc(this.uid)
      .collection('item-update')
      .doc(this.itemUpdate.itemUpdateId)
      .update({ itemId: itemId, itemName: itemName, listName: listName });
  }

  public setSuperList(list: SuperList) {
    this.superList = list;
  }

  public setSharedList(list: SuperList) {
    this.sharedList = list;
  }

  public getSharedList(): SuperList {
    return this.sharedList;
  }

  public listExists(name: string) {
    return this.db
      .collection('super-list')
      .doc(this.uid)
      .collection('user-list', ref => {
        return ref.where('name', '==', name);
      })
      .valueChanges()
      .pipe(take(1));
    // .subscribe(data => {
    //   return data;
    // });
  }

  public addSharedListToMyList(): Observable<SuperList> {
    const jsonHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json'
    );

    return this.httpClient
      .post(
        'https://us-central1-superlist-80690.cloudfunctions.net/addSharedListToMyList',
        {
          token: this.token,
          uid: this.uid,
          list: this.sharedList
        },
        { headers: jsonHeaders }
      )
      .pipe(
        map((data: { message: string; superList: SuperList }) => {
          return {
            id: data.superList.id,
            name: data.superList.name,
            description: data.superList.description,
            items: data.superList.items
          };
        })
      );
  }

  public addNewList(name: string, description: string): Observable<SuperList> {
    const jsonHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json'
    );

    return this.httpClient
      .post(
        'https://us-central1-superlist-80690.cloudfunctions.net/addNewList',
        {
          token: this.token,
          uid: this.uid,
          name: name,
          description: description
        },
        { headers: jsonHeaders }
      )
      .pipe(
        map((data: { message: string; superList: SuperList }) => {
          console.log('new list add: ', data);
          return {
            id: data.superList.id,
            name: data.superList.name,
            description: data.superList.description,
            items: data.superList.items
          };
        })
      );
    // return this.db
    //   .collection('super-list')
    //   .doc(this.uid)
    //   .collection('user-list')
    //   .add({ name: name, description: description, items: [] })
    //   .then(data => {
    //     if (!this.superList) {
    //       this.db
    //         .collection('super-list')
    //         .doc(this.uid)
    //         .collection('item-update')
    //         .add({ itemName: '', listName: '' });
    //     }
    //     return { name: name, description: description, items: [] };
    //   });
  }

  public getUserLists() {
    // console.log('User ID: ', this.uid);

    return this.db
      .collection('super-list')
      .doc(this.uid)
      .collection('user-list')
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              ...doc.payload.doc.data()
            };
          });
        })
      );
  }

  public getSharedLists(): Observable<any[]> {
    return this.db
      .collection('shared-list')
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => {
            return {
              // id: doc.payload.doc.id,
              ...doc.payload.doc.data()
            };
          });
        })
      );
  }

  public addItem(superList: SuperList, item: Item) {
    const jsonHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json'
    );

    return this.httpClient
      .post(
        'https://us-central1-superlist-80690.cloudfunctions.net/addItem',
        {
          token: this.token,
          uid: this.uid,
          superList: superList,
          newItem: item
        },
        { headers: jsonHeaders }
      )
      .pipe(
        map(data => {
          return data;
        })
      );
    // item.id = superList.items.length;
    // superList.items.push(item);
    // this.db
    //   .collection('super-list')
    //   .doc(this.uid)
    //   .collection('user-list', ref => {
    //     return ref.where('name', '==', superList.name);
    //   })
    //   .doc(superList.id)
    //   .update({ items: superList.items })
    //   .then(
    //     () => {
    //       console.log('Add new item ');
    //     },
    //     error => {
    //       console.log(error);
    //     }
    //   );
  }

  public getItemsList(listName: string, listId: string): Observable<any> {
    // console.log('listId: ', listId);
    // console.log('listName: ', listName);
    return this.db
      .collection('super-list')
      .doc(this.uid)
      .collection('user-list')
      .doc(listId)
      .snapshotChanges()
      .pipe(
        map(docArray => {
          // console.log('docArray data: ', docArray.payload.data());
          // console.log('docArray ID: ', docArray.payload.id);
          return {
            id: docArray.payload.id,
            ...docArray.payload.data()
          };
        })
      );

    // return this.db
    //   .collection('super-list')
    //   .doc(this.uid)
    //   .collection('user-list', ref => {
    //     return ref.where('name', '==', listName);
    //   })
    //   .snapshotChanges()
    //   .map(docArray => {
    //     return docArray.map(doc => {
    //       return {
    //         id: doc.payload.doc.id,
    //         ...doc.payload.doc.data()
    //       };
    //     });
    //   });
  }

  // delete list and all items
  public deleteList(listId: string) {
    const jsonHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json'
    );

    return this.httpClient
      .post(
        'https://us-central1-superlist-80690.cloudfunctions.net/deleteList',
        {
          uid: this.uid,
          token: this.token,
          listId: listId
        },
        { headers: jsonHeaders }
      )
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  public deleteItem(itemId: number) {
    const jsonHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json'
    );

    return this.httpClient
      .post(
        'https://us-central1-superlist-80690.cloudfunctions.net/deleteItem',
        {
          uid: this.uid,
          token: this.token,
          listId: this.superList.id,
          superList: this.superList,
          deleteItemId: itemId
        },
        { headers: jsonHeaders }
      )
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  public setItemDone(itemId: number) {
    const itemIndex = this.getItemIndex(itemId);
    this.superList.items[itemIndex].done = !this.superList.items[itemIndex]
      .done;
    // console.log('item id: ', itemId);
    // console.log('item index: ', itemIndex);

    this.db
      .collection('super-list')
      .doc(this.uid)
      .collection('user-list')
      .doc(this.superList.id)
      .update({ items: this.superList.items })
      .then(
        () => {
          console.log('update item done');
        },
        error => {
          console.log(error);
        }
      );
  }

  public resetAllItems() {
    console.log('Reset all item');
    this.superList.items.forEach(item => {
      item.done = false;
    });
    this.db
      .collection('super-list')
      .doc(this.uid)
      .collection('user-list')
      .doc(this.superList.id)
      .update({ items: this.superList.items })
      .then(
        () => {
          console.log('update item done');
        },
        error => {
          console.log(error);
        }
      );
  }

  public updateListDetailes(listId: string, name: string, description: string) {
    // console.log(listId);
    // console.log(name);
    // console.log(description);

    return this.db
      .collection('super-list')
      .doc(this.uid)
      .collection('user-list', ref => {
        return ref.where('name', '==', name);
      })
      .doc(listId)
      .update({ name: name, description: description });
  }

  public updateItem(item: Item) {
    // console.log('update lis ID: ', this.superList.id);
    // console.log('update item: ', item);
    const itemIndex = this.getItemIndex(item.id);
    this.superList.items[itemIndex] = item;

    this.db
      .collection('super-list')
      .doc(this.uid)
      .collection('user-list')
      .doc(this.superList.id)
      .update({ items: this.superList.items })
      .then(
        () => {
          // this.setItemUpdate(item.id, item.name, this.superList.name);
          this.setItemUpdate(itemIndex, item.name, this.superList.name);
          this.userUpdateItem = true;
        },
        error => {
          console.log(error);
        }
      );
  }

  private getItemIndex(itemId: number): number {
    const itemIndex = this.superList.items.findIndex(item => {
      return item.id === itemId;
    });
    return itemIndex;
  }

  public getUserUpdateItem(): boolean {
    return this.userUpdateItem;
  }

  public setUserUpdateItem(ans: boolean) {
    this.userUpdateItem = ans;
  }

  public testDelete() {
    // const jsonHeaders = new HttpHeaders().set(
    //   'Content-Type',
    //   'application/json'
    // );
    // return this.httpClient
    //   .post(
    //     'https://us-central1-superlist-80690.cloudfunctions.net/testDelete',
    //     {
    //       uid: this.uid,
    //       token: this.token
    //     },
    //     { headers: jsonHeaders }
    //   )
    //   .pipe(
    //     map(data => {
    //       return data;
    //     })
    //   )
    //   .subscribe(data => {
    //     console.log('Data: ', data);
    //   });
    // console.log('Start delete');
    // this.db
    //   .collection('super-list')
    //   .doc(this.uid)
    //   .collection('item-update')
    //   .get({ source: 'default' })
    //   .subscribe(data => {
    //     data.docs.forEach(doc => {
    //       console.log('ID', doc.id);
    //     });
    //     console.log('User list');
    //     this.db
    //       .collection('super-list')
    //       .doc(this.uid)
    //       .collection('user-list')
    //       .get({ source: 'default' })
    //       .subscribe(data1 => {
    //         data1.docs.forEach(doc => {
    //           console.log('ID', doc.id);
    //         });
    //       });
    //   });
    // ==============================================
    // .snapshotChanges()
    // .pipe(
    //   map(docArray => {
    //     return docArray.map(doc => {
    //       return {
    //         id: doc.payload.doc.id,
    //         ...doc.payload.doc.data()
    //       };
    //     });
    //   })
    // )
    // .subscribe(data => {
    //   if (data.length > 0) {
    //     const id = data[0].id;
    //     console.log('Doc ID: ', id);
    //     this.db
    //       .collection('super-list')
    //       .doc('CMiGkfmQRdbjfX8QTOinrELs7Xt2')
    //       .collection('item-update')
    //       .doc(id)
    //       .delete();
    //   }
    // });
  }
}