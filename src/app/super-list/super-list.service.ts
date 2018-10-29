import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { SppinerMsgBoxComponent } from './../messages-box/sppiner-msg-box/sppiner-msg-box.component';
import { OkMsgComponent } from './../messages-box/ok-msg/ok-msg.component';
import { Item } from './item';
import { Observable, Subscription } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { AuthService } from './../auth/auth.service';
import { SuperList } from './super-list';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { log } from 'util';

export interface ItemUpdate {
  itemUpdateId: string;
  itemId: number;
  itemName: string;
  listName: string;
  uid: string;
}

@Injectable({
  providedIn: 'root'
})
export class SuperListService {
  private superList: SuperList;
  private sharedList: SuperList;
  private uid: string;
  private token: string;
  private itemUpdate: ItemUpdate;
  // private userUpdateItem: boolean;
  // public userUpdateItemEvent = new EventEmitter<ItemUpdate>();
  // private itemUpdateSub: Subscription;

  constructor(
    private httpClient: HttpClient,
    private db: AngularFirestore,
    private dialog: MatDialog,
    private afAuth: AngularFireAuth
  ) {
    this.uid = this.afAuth.auth.currentUser.uid;
    // this.userUpdateItem = false;
    // this.getItemUpdate();
    // this.token = this.authService.getToken();
    this.afAuth.auth.currentUser.getIdToken(false).then(token => {
      this.token = token;
      // console.log('Token: ', token);
    });
  }

  public getUserID(): string {
    return this.uid;
  }

  public getCurentListID(): string {
    return this.superList.id;
  }

  public unSubscription() {
    // this.itemUpdateSub.unsubscribe();
  }

  public setUserId() {
    this.uid = this.afAuth.auth.currentUser.uid;
    this.superList = null; // איפוס רשימה לאחר החלפת משתמש
  }

  // public getItemUpdate() {
  //   this.itemUpdateSub = this.db
  //     .collection('super-list')
  //     .doc(this.uid)
  //     .collection('item-update')
  //     .snapshotChanges()
  //     .pipe(
  //       map(docArray => {
  //         return docArray.map(doc => {
  //           this.itemUpdate = {
  //             itemUpdateId: doc.payload.doc.id,
  //             itemId: doc.payload.doc.data().itemId,
  //             itemName: doc.payload.doc.data().itemName,
  //             listName: doc.payload.doc.data().listName,
  //             uid: doc.payload.doc.data().uid
  //           };
  //           return this.itemUpdate;
  //         });
  //       })
  //     )
  //     .subscribe(
  //       data => {
  //         if (!this.getUserUpdateItem()) {
  //           if (data.length > 0) {
  //             if (data[0].itemId > -1) {
  //               this.userUpdateItemEvent.emit(data[0]);
  //               const dialogRef = this.dialog.open(OkMsgComponent, {
  //                 width: '25rem',
  //                 data: {
  //                   message: `ברשימה ${data[0].listName} עודכן הפריט ${
  //                     data[0].itemName
  //                   }`
  //                 }
  //               });
  //               dialogRef.afterClosed().subscribe(result => {
  //                 console.log('ans: ', result);
  //                 this.setUserUpdateItem(false);
  //                 this.setItemUpdate(-1, '', '', '');
  //               });
  //             }
  //           }
  //         } else {
  //           this.setUserUpdateItem(false);
  //         }
  //       },
  //       error => {
  //         this.itemUpdateSub.unsubscribe();
  //       }
  //     );
  // }

  // set the item was updated
  private setItemUpdate(
    itemId: number,
    itemName: string,
    listName: string,
    uid: string
  ) {
    this.db
      .collection('super-list')
      .doc(this.uid)
      .collection('item-update')
      .doc(this.itemUpdate.itemUpdateId)
      .update({
        itemId: itemId,
        itemName: itemName,
        listName: listName,
        uid: uid
      });
  }

  public setSuperList(list: SuperList) {
    this.superList = list;
  }

  public getSuperList(): SuperList {
    return this.superList;
  }

  public setSharedList(list: SuperList) {
    this.sharedList = list;
  }

  public getSharedList(): SuperList {
    return this.sharedList;
  }

  public getUserItemsPictureList(): Observable<any> {
    return this.db
      .collection('super-list')
      .doc(this.uid)
      .collection('items-picture')
      .get()
      .pipe(
        map(querySnapshot => {
          return querySnapshot.docs.map(item => {
            return {
              id: item.id,
              ...item.data()
            };
          });
        })
      );
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

  public addSharedListToMyList(): Promise<Observable<SuperList>> {
    const jsonHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json'
    );

    return this.afAuth.auth.currentUser
      .getIdToken(false)
      .then(token => {
        this.token = token;
      })
      .then(() => {
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
      });
  }

  public addNewList(
    name: string,
    description: string
  ): Promise<Observable<SuperList>> {
    const jsonHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json'
    );

    return this.afAuth.auth.currentUser
      .getIdToken(false)
      .then(token => {
        this.token = token;
      })
      .then(() => {
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
              // console.log('new list add: ', data);
              return {
                id: data.superList.id,
                name: data.superList.name,
                description: data.superList.description,
                items: data.superList.items
              };
            })
          );
      });

    // return this.httpClient
    //   .post(
    //     'https://us-central1-superlist-80690.cloudfunctions.net/addNewList',
    //     {
    //       token: this.token,
    //       uid: this.uid,
    //       name: name,
    //       description: description
    //     },
    //     { headers: jsonHeaders }
    //   )
    //   .pipe(
    //     map((data: { message: string; superList: SuperList }) => {
    //       console.log('new list add: ', data);
    //       return {
    //         id: data.superList.id,
    //         name: data.superList.name,
    //         description: data.superList.description,
    //         items: data.superList.items
    //       };
    //     })
    //   );

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

  public getUserListsByUserId(userId: string) {
    return this.db
      .collection('super-list')
      .doc(userId)
      .collection('user-list', ref => {
        return ref.orderBy('name');
      })
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => {
            return {
              id: doc.payload.doc.id,
              name: doc.payload.doc.data().name,
              description: doc.payload.doc.data().description,
              items: doc.payload.doc.data().items
            };
          });
        })
      );
  }

  public getUserList(uid: string, listId: string): Observable<any> {
    return this.db
      .collection('super-list')
      .doc(uid)
      .collection('user-list')
      .doc(listId)
      .snapshotChanges()
      .pipe(
        map(doc => {
          return {
            id: doc.payload.id,
            ...doc.payload.data()
          };
        })
      );
  }

  public getUserLists() {
    // console.log('User ID: ', this.uid);

    return this.db
      .collection('super-list')
      .doc(this.uid)
      .collection('user-list', ref => {
        return ref.orderBy('name');
      })
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

  public addItemToSharedList(userId: string, list: SuperList, newItem: Item) {
    // set item id
    if (list.items.length > 0) {
      const index = list.items.length - 1;
      newItem.id = list.items[index].id + 1;
    } else {
      newItem.id = 0;
    }
    list.items.push(newItem);

    return this.db
      .collection('super-list')
      .doc(userId)
      .collection('user-list')
      .doc(list.id)
      .update({ items: list.items });
  }

  public addItem(superList: SuperList, item: Item): Promise<Observable<any>> {
    const jsonHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json'
    );

    return this.afAuth.auth.currentUser
      .getIdToken(false)
      .then(token => {
        this.token = token;
      })
      .then(() => {
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
      });

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
  public deleteList(listId: string): Promise<Observable<any>> {
    const jsonHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json'
    );

    return this.afAuth.auth.currentUser
      .getIdToken(false)
      .then(token => {
        this.token = token;
      })
      .then(() => {
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
      });
  }

  public deleteItemBySharedUser(
    itemId: number,
    userId: string,
    listId: string
  ): Observable<Promise<SuperList>> {
    return this.db
      .collection('super-list')
      .doc(userId)
      .collection('user-list')
      .doc(listId)
      .get()
      .pipe(
        map(snapshot => {
          const itemIndex = snapshot.data().items.findIndex(item => {
            return item.id === itemId;
          });
          const items = [...snapshot.data().items];
          items.splice(itemIndex, 1);

          return this.db
            .collection('super-list')
            .doc(userId)
            .collection('user-list')
            .doc(listId)
            .update({ items: items })
            .then(() => {
              return {
                id: snapshot.id,
                name: snapshot.data().name,
                description: snapshot.data().description,
                items: items
              };
            });
        })
      );
  }

  public deleteItem(itemId: number): Promise<Observable<any>> {
    const jsonHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json'
    );

    return this.afAuth.auth.currentUser
      .getIdToken(false)
      .then(token => {
        this.token = token;
      })
      .then(() => {
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
      });
  }

  public setItemDoneBySharedUser(
    itemId: number,
    userId: string,
    listId: string
  ) {
    this.db
      .collection('super-list')
      .doc(userId)
      .collection('user-list')
      .doc(listId)
      .get()
      .pipe(
        map(snapshot => {
          return {
            id: snapshot.id,
            ...snapshot.data()
          };
        })
      )
      .subscribe((list: SuperList) => {
        const itemIndex = list.items.findIndex(item => {
          return item.id === itemId;
        });
        list.items[itemIndex].done = !list.items[itemIndex].done;
        this.db
          .collection('super-list')
          .doc(userId)
          .collection('user-list')
          .doc(listId)
          .update({ items: list.items })
          .then(
            () => {
              console.log('update item done');
            },
            error => {
              console.log(error);
            }
          );
      });
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

  public resetListItems(uid: string, listId: string, items: Item[]) {
    this.db
      .collection('super-list')
      .doc(uid)
      .collection('user-list')
      .doc(listId)
      .update({ items: items })
      .then(
        () => {
          console.log('update reset user list Items done');
        },
        error => {
          console.log(error);
        }
      );
  }

  public resetAllItems() {
    // console.log('Reset all item');
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
          console.log('update reset All Items done');
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

  public updateItemBySharedUser(userId: string, listId: string, item: Item) {
    this.db
      .collection('super-list')
      .doc(userId)
      .collection('user-list')
      .doc(listId)
      .get()
      .pipe(
        map(snapshot => {
          return {
            id: snapshot.id,
            ...snapshot.data()
          };
        })
      )
      .subscribe(
        (list: SuperList) => {
          const itemIndex = list.items.findIndex(lItem => {
            return lItem.id === item.id;
          });
          list.items[itemIndex] = item;
          this.db
            .collection('super-list')
            .doc(userId)
            .collection('user-list')
            .doc(listId)
            .update({ items: list.items });
          // לשלוח הודעה לבעלים של הרשימה
          this.sendMessageBySharedUser(list.name, item, userId).then(
            payload => {
              payload.subscribe(data => {
                console.log(data);
              });
            }
          );
        },
        error => {
          console.log(error);
        }
      );
  }

  public updateItemPictureUrlFromPictureList(
    picUrl: string,
    itemId: number,
    userId: string,
    listId: string
  ) {
    // get Items list
    const updatePromise = new Promise((resolve, reject) => {
      this.db
        .collection('super-list')
        .doc(userId)
        .collection('user-list')
        .doc(listId)
        .get()
        .pipe(
          map(snapshot => {
            return {
              id: snapshot.id,
              ...snapshot.data()
            };
          })
        )
        .subscribe((list: SuperList) => {
          const itemIndex = list.items.findIndex(item => {
            return item.id === itemId;
          });

          list.items[itemIndex].pictureUrl = picUrl;
          // update item
          this.db
            .collection('super-list')
            .doc(userId)
            .collection('user-list')
            .doc(listId)
            .update({ items: list.items })
            .then(
              () => {
                resolve();
              },
              error => {
                reject(error);
              }
            );
        });
    });

    return updatePromise;
  }

  public updateItemPictureUrl(
    picUrl: string,
    itemId: number,
    userId: string,
    listId: string
  ) {
    // get Items list
    const updatePromise = new Promise((resolve, reject) => {
      this.db
        .collection('super-list')
        .doc(userId)
        .collection('user-list')
        .doc(listId)
        .get()
        .pipe(
          map(snapshot => {
            return {
              id: snapshot.id,
              ...snapshot.data()
            };
          })
        )
        .subscribe((list: SuperList) => {
          const itemIndex = list.items.findIndex(item => {
            return item.id === itemId;
          });

          list.items[itemIndex].pictureUrl = picUrl;
          const itemName = list.items[itemIndex].name;

          // update items
          this.db
            .collection('super-list')
            .doc(userId)
            .collection('user-list')
            .doc(listId)
            .update({ items: list.items })
            .then(
              () => {
                // הוספת מיקום התמונה לרשימת התמונות של המשתמש
                this.db
                  .collection('super-list')
                  .doc(userId)
                  .collection('items-picture')
                  .add({ itemName: itemName, picUrl: picUrl })
                  .then(
                    () => {
                      resolve();
                    },
                    error => {
                      reject(error);
                    }
                  );
              },
              error => {
                reject(error);
              }
            );
        });
    });
    return updatePromise;
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
          // this.setItemUpdate(
          //   itemIndex,
          //   item.name,
          //   this.superList.name,
          //   this.uid
          // );
          this.sendMessage(item).then(payload => {
            payload.subscribe(data => {
              console.log(data);
            });
          });
          // this.userUpdateItem = true;
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

  // public getUserUpdateItem(): boolean {
  //   return this.userUpdateItem;
  // }

  // public setUserUpdateItem(ans: boolean) {
  //   this.userUpdateItem = ans;
  // }

  public shareMyList(email: string): Promise<Observable<any>> {
    const jsonHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json'
    );

    return this.afAuth.auth.currentUser
      .getIdToken(false)
      .then(token => {
        this.token = token;
      })
      .then(() => {
        return this.httpClient
          .post(
            'https://us-central1-superlist-80690.cloudfunctions.net/shareUser',
            {
              uid: this.uid,
              token: this.token,
              email: email,
              userEmail: this.afAuth.auth.currentUser.email
            },
            { headers: jsonHeaders }
          )
          .pipe(
            map(data => {
              return data;
            })
          );
      });
  }

  private sendMessageBySharedUser(
    listName: string,
    item: Item,
    userId: string
  ) {
    const jsonHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json'
    );

    return this.afAuth.auth.currentUser
      .getIdToken(false)
      .then(token => {
        this.token = token;
      })
      .then(() => {
        return this.httpClient
          .post(
            'https://us-central1-superlist-80690.cloudfunctions.net/sendMessageBySharedUser',
            {
              userId: userId,
              authorizedUserId: this.uid,
              token: this.token,
              title: listName,
              message: 'הפריט ' + item.name + ' עודכן'
            },
            { headers: jsonHeaders }
          )
          .pipe(
            map(data => {
              return data;
            })
          );
      });
  }

  private sendMessage(item: Item): Promise<Observable<any>> {
    const jsonHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json'
    );

    return this.afAuth.auth.currentUser
      .getIdToken(false)
      .then(token => {
        this.token = token;
      })
      .then(() => {
        return this.httpClient
          .post(
            'https://us-central1-superlist-80690.cloudfunctions.net/sendMessage',
            {
              uid: this.uid,
              token: this.token,
              title: this.superList.name,
              message: 'הפריט ' + item.name + ' עודכן'
            },
            { headers: jsonHeaders }
          )
          .pipe(
            map(data => {
              return data;
            })
          );
      });
  }

  public getMySharedUsers(): Observable<
    { id: string; authorizedUserId: string; authorizedUserEmail: string }[]
  > {
    return this.db
      .collection('shared-user', ref => {
        return ref.where('userId', '==', this.uid);
      })
      .get()
      .pipe(
        map(snapshot => {
          return snapshot.docs.map(doc => {
            return {
              id: doc.id,
              authorizedUserId: doc.data().authorizedUserId,
              authorizedUserEmail: doc.data().authorizedUserEmail
            };
          });
        })
      );
  }

  // מחזיר רשימת משתמשים שמשתפים איתי את הרשימות שלהם
  public getUsersSharedWithMe(): Observable<
    { userId: string; userEmail: string }[]
  > {
    return this.db
      .collection('shared-user', ref => {
        return ref.where('authorizedUserId', '==', this.uid);
      })
      .get()
      .pipe(
        map(snapshot => {
          return snapshot.docs.map(doc => {
            return {
              userId: doc.data().userId,
              userEmail: doc.data().userEmail
            };
          });
        })
      );
  }

  public delSharedUser(id: string) {
    // console.log('stop share list with: ', id);
    return this.db
      .collection('shared-user')
      .doc(id)
      .delete()
      .then(() => {
        return 'done';
      });
  }

  public getMeasureList(): Observable<{ id: string; name: string }[]> {
    return this.db
      .collection('measurements')
      .get()
      .pipe(
        map(snapshot => {
          return snapshot.docs.map(doc => {
            return {
              id: doc.id,
              name: doc.data().name
            };
          });
        })
      );
  }

  // public sendPictureToServer(picture: Blob) {
  //   const id = new Date().toISOString();
  //   const postData = new FormData();
  //   postData.append('id', id);
  //   postData.append('uid', this.uid);
  //   postData.append('token', this.token);
  //   postData.append('picture', picture);

  //   return this.afAuth.auth.currentUser
  //     .getIdToken(false)
  //     .then(token => {
  //       this.token = token;
  //     })
  //     .then(() => {
  //       return this.httpClient
  //         .post(
  //           'https://us-central1-superlist-80690.cloudfunctions.net/sendPicture',
  //           postData
  //         )
  //         .pipe(
  //           map(data => {
  //             return data;
  //           })
  //         );
  //     });
  // }
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
