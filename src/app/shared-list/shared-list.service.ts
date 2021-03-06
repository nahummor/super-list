import { AngularFireAuth } from '@angular/fire/auth';
import { Item } from './../super-list/item';
import { AngularFirestore } from '@angular/fire/firestore';
import { SuperList } from './../super-list/super-list';
import { AuthService } from './../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SharedListService {
  private token: string;
  private uid: string;

  constructor(
    private db: AngularFirestore,
    private httpClient: HttpClient,
    private afAuth: AngularFireAuth
  ) {
    this.uid = this.afAuth.auth.currentUser.uid;
    this.afAuth.auth.currentUser.getIdToken(false).then(token => {
      this.token = token;
    });

    this.getAllSharedItems();
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

  public addNewSharedList(
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
            'https://us-central1-superlist-80690.cloudfunctions.net/addNewSharedList',
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

  public addItem(sharedList: SuperList, item: Item): Promise<Observable<any>> {
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
            'https://us-central1-superlist-80690.cloudfunctions.net/addSharedItem',
            {
              token: this.token,
              sharedList: sharedList,
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
  }

  public getItemsSharedList(
    name: string,
    description: string
  ): Observable<any> {
    return this.db
      .collection('shared-list', ref => {
        return ref
          .where('name', '==', name)
          .where('description', '==', description);
      })
      .snapshotChanges()
      .pipe(
        map(listArray => {
          return listArray.map(list => {
            return {
              id: list.payload.doc.id,
              ...list.payload.doc.data()
            };
          });
        })
      );
  }

  // return items list from all shared lists
  public getAllSharedItems(): Observable<Item[]> {
    const sharedItems: Item[] = [];

    return this.db
      .collection('shared-list')
      .get()
      .pipe(
        map(listArray => {
          return listArray.docs.map(doc => {
            return {
              id: doc.id,
              name: doc.data().name,
              description: doc.data().description,
              items: doc.data().items
            };
          });
        }),
        map(lists => {
          lists.forEach(list => {
            list.items.forEach(item => {
              sharedItems.push(item);
            });
          });
          return sharedItems;
        })
      );
  }

  public getSharedList(): Observable<any> {
    return this.db
      .collection('shared-list')
      .snapshotChanges()
      .pipe(
        map(listArray => {
          return listArray.map(list => {
            return {
              id: list.payload.doc.id,
              ...list.payload.doc.data()
            };
          });
        })
      );
  }

  // delete shared list and all items
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
            'https://us-central1-superlist-80690.cloudfunctions.net/deleteSharedList',
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

  public deleteItem(listId: string, item: Item): Promise<Observable<any>> {
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
            'https://us-central1-superlist-80690.cloudfunctions.net/deleteSharedItem',
            {
              token: this.token,
              listId: listId,
              deleteItem: item
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

  public updateListDetailes(listId: string, name: string, description: string) {
    return this.db
      .collection('shared-list')
      .doc(listId)
      .update({ name: name, description: description });
  }

  public updateItem(
    listId: string,
    newItem: Item,
    oldItem: Item
  ): Promise<Observable<any>> {
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
            'https://us-central1-superlist-80690.cloudfunctions.net/updateSharedItem',
            {
              token: this.token,
              listId: listId,
              newItem: newItem,
              oldItem: oldItem
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
}
