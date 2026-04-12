import { Component } from '@angular/core';
import { TodoListComponent } from './todo-list/todo-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodoListComponent],
  template: `<app-todo-list />`
})
export class App {}  // ← make sure "export" is here