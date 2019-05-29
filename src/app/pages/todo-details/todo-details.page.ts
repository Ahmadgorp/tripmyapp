import { Component, OnInit } from '@angular/core';
import { TaskI } from '../../models/task.interface';
import { TodoService } from '../../services/todo.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular' ;

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.page.html',
  styleUrls: ['./todo-details.page.scss'],
})
export class TodoDetailsPage implements OnInit {

  todo: TaskI = {
   
    task: '',
    priority: 0
  };

  todoId = null;

  constructor( 
    private route: ActivatedRoute,
    private todoService: TodoService,
    private nav: NavController,
    private loadingController: LoadingController,
    ) { }

  ngOnInit() {
    this.todoId = this.route.snapshot.params['id'];
    if (this.todoId) {
      this.loadTodo();
    }
  }
    async loadTodo() {
      const loading = await this.loadingController.create({
        message: 'loading.....'
      });
      await loading.present();
      this.todoService.getTodo(this.todoId).subscribe(res => {
        loading.dismiss();
        this.todo = res;
      });
    }

    async saveTodo() {
      const loading = await this.loadingController.create({
        message: 'Saving.....'
      });
      await loading.present();

      if (this.todoId) {
        //update
        this.todoService.updateTodo(this.todo, this.todoId).then(() => {
          loading.dismiss();
          this.nav.navigateForward('/');
        });
      } else {
        //Add new
        this.todoService.addTodo(this.todo).then(() => {
          loading.dismiss();
          this.nav.navigateForward('/');
        });
      }
    }
    onRemove(idTodo: string) {
      this.todoService.removeTodo(idTodo);
    }
  }


