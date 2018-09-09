import { AngularFirestore } from 'angularfire2/firestore';
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
    private authService: AuthService
  ) {
    this.uid = this.authService.getUserId();
    this.token = this.authService.getToken();
  }

  public addNewSharedList(
    name: string,
    description: string
  ): Observable<SuperList> {
    const jsonHeaders = new HttpHeaders().set(
      'Content-Type',
      'application/json'
    );

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

  public getSharedList() {}
}
