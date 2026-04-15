import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';   
import { Task } from '../task.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [NgClass],                     
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.css'
})
export class TodoItemComponent {

  task = input.required<Task>();
  deleted = output<string>();
  toggled = output<string>();

  showConfirm = false;

  onDeleteClick(): void {
    this.showConfirm = true;
  }

  onConfirmDelete(): void {
    this.deleted.emit(this.task().id);
    this.showConfirm = false;
  }

  onCancelDelete(): void {
    this.showConfirm = false;
  }

  onToggle(): void {
    this.toggled.emit(this.task().id);
  }
}