import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private db: AngularFirestore) {}

  public getMessagesList(): Observable<
    { id: string; msgNumber: number; message: string }[]
  > {
    const today = new Date();
    return this.db
      .collection('admin-messages', ref => {
        return ref.where('expDate', '>', today);
      })
      .get()
      .pipe(
        map(snapshot => {
          return snapshot.docs.map(doc => {
            return {
              id: doc.id,
              msgNumber: doc.data().msgNumber,
              message: doc.data().message
            };
          });
        }),
        map(messages => {
          return messages.sort((num1, num2) => {
            if (num1.msgNumber > num2.msgNumber) {
              return 1;
            }
            return -1;
          });
        })
      );
  }
}
