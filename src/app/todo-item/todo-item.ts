import { Component, input, output } from '@angular/core';
import { Task } from '../task.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.css'
})
export class TodoItemComponent {

  task = input.required<Task>();
  deleted = output<string>();
  toggled = output<string>();

  showConfirm = false;   // ← controls the confirm box

  onDeleteClick(): void {
    this.showConfirm = true;   // ← show the modal
  }

  onConfirmDelete(): void {
    this.deleted.emit(this.task().id);
    this.showConfirm = false;
  }

  onCancelDelete(): void {
    this.showConfirm = false;  // ← hide without deleting
  }

  onToggle(): void {
    this.toggled.emit(this.task().id);
  }
}