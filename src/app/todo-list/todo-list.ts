import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../todo.service';
import { TodoItemComponent } from '../todo-item/todo-item';
import { Task } from '../task.model';

type Filter = 'all' | 'active' | 'done';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [FormsModule, TodoItemComponent],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css'
})
export class TodoListComponent implements OnInit {

  tasks: Task[] = [];
  newTaskTitle = '';
  searchQuery = '';
  activeFilter: Filter = 'all';
  selectedDate = new Date().toISOString().split('T')[0];

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.tasks = this.todoService.getTasks(this.selectedDate);
  }

  addTask(): void {
    if (!this.newTaskTitle.trim()) return;
    this.todoService.addTask(this.newTaskTitle.trim(), this.selectedDate);
    this.newTaskTitle = '';
    this.loadTasks();
  }

  onDelete(id: string): void {
    this.todoService.deleteTask(id);
    this.loadTasks();
  }

  onToggle(id: string): void {
    this.todoService.toggleTask(id);
    this.loadTasks();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.addTask();
  }

  setFilter(filter: Filter): void {
    this.activeFilter = filter;
  }

  get remainingCount(): number {
    return this.tasks.filter(t => !t.completed).length;
  }

  get filteredTasks(): Task[] {
    let result = this.tasks;

    if (this.activeFilter === 'active') {
      result = result.filter(t => !t.completed);
    } else if (this.activeFilter === 'done') {
      result = result.filter(t => t.completed);
    }

    if (this.searchQuery.trim()) {
      result = result.filter(t =>
        t.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    return result;
  }
}