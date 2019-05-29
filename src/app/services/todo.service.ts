import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskI } from '../models/task.interface';
// import { Action } from 'rxjs/internal/scheduler/Action';


@Injectable({
  providedIn: 'root'
})
export class TodoService {
  // addTodo(todo: TaskI) {
  //   throw new Error("Method not implemented.");
  // }

  private todoscollection: AngularFirestoreCollection<TaskI>;
  private todos: Observable<TaskI[]>;

  constructor( db: AngularFirestore) {
    this.todoscollection = db.collection<TaskI>('todos');
    this.todos = this.todoscollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a =>{
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }
    ));
   }
   getTodos() {
     return this.todos;
   }

   getTodo( id: string) {
     return this.todoscollection.doc<TaskI>(id).valueChanges();
   }

   updateTodo( todo: TaskI, id: string) {
     return this.todoscollection.doc(id).update(todo);
   }

   addTodo(todo:TaskI) {
     return this.todoscollection.add(todo);
   }

   removeTodo(id: string) {
     return this.todoscollection.doc(id).delete();
   }
}
