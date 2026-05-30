import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../task.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.css'
})
export class TodoItemComponent {

  task = input.required<Task>();
  deleted = output<number>();
  toggled = output<number>();
  edited = output<{ id: number; taskText: string }>();

  showConfirm = false;
  isEditing = false;
  editText = '';

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

  startEdit(): void {
    this.editText = this.task().taskText;
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  saveEdit(): void {
    const trimmed = this.editText.trim();
    if (trimmed && trimmed !== this.task().taskText) {
      this.edited.emit({ id: this.task().id, taskText: trimmed });
    }
    this.isEditing = false;
  }

  onEditKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }
}