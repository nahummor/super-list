import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private db: AngularFirestore) {}

  public getMessagesList(): Observable<{ id: string; message: string }[]> {
    return this.db
      .collection('admin-messages')
      .get()
      .pipe(
        map(snapshot => {
          return snapshot.docs.map(doc => {
            return {
              id: doc.id,
              message: doc.data().message
            };
          });
        })
      );
  }
}
