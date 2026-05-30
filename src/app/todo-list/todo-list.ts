import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../todo.service';
import { TodoItemComponent } from '../todo-item/todo-item';
import { CalendarStripComponent } from '../calendar/calendar';
import { Task } from '../task.model';

type Filter = 'all' | 'active' | 'done';

@Component({
  selector: 'todo-list',
  standalone: true,
  imports: [FormsModule, TodoItemComponent, CalendarStripComponent],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css'
})
export class TodoListComponent implements OnInit {

  tasks: Task[] = [];
  newTaskTitle = '';
  searchQuery = '';
  activeFilter: Filter = 'all';
  selectedDate = '';

  constructor(
    private todoService: TodoService,
    private cdr: ChangeDetectorRef
  ) {
    this.selectedDate = this.toDateString(new Date());
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  onDateSelected(date: string): void {
    this.selectedDate = date;
    this.loadTasks();
  }

  loadTasks(): void {
    this.todoService.getTasksByDate(this.selectedDate).subscribe({
      next: (data) => {
        this.tasks = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load tasks', err)
    });
  }

  addTask(): void {
    if (!this.newTaskTitle.trim()) return;
    const title = this.newTaskTitle.trim();
    this.newTaskTitle = '';

    this.todoService.addTask(title, this.selectedDate).subscribe({
      next: (saved) => {
        this.tasks = [...this.tasks, saved];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to add task', err)
    });
  }

  onDelete(id: number): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.cdr.detectChanges();

    this.todoService.deleteTask(id).subscribe({
      error: (err) => {
        console.error('Delete failed, reverting', err);
        this.loadTasks();
      }
    });
  }

  onToggle(id: number): void {
    this.tasks = this.tasks.map(t => {
      if (t.id === id) {
        return {
          ...t,
          taskStatus: t.taskStatus === 'COMPLETED' ? 'NOT_COMPLETED' : 'COMPLETED'
        };
      }
      return t;
    });
    this.cdr.detectChanges();

    this.todoService.toggleTask(id).subscribe({
      error: (err) => {
        console.error('Toggle failed, reverting', err);
        this.loadTasks();
      }
    });
  }

  onEdit(event: { id: number; taskText: string }): void {
    this.tasks = this.tasks.map(t => {
      if (t.id === event.id) {
        return { ...t, taskText: event.taskText };
      }
      return t;
    });
    this.cdr.detectChanges();

    this.todoService.updateTask(event.id, event.taskText).subscribe({
      error: (err) => {
        console.error('Edit failed, reverting', err);
        this.loadTasks();
      }
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.addTask();
  }

  setFilter(filter: Filter): void {
    this.activeFilter = filter;
  }

  get formattedDate(): string {
    const parts = this.selectedDate.split('-');
    const d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  }

  get remainingCount(): number {
    return this.tasks.filter(t => t.taskStatus === 'NOT_COMPLETED').length;
  }

  get filteredTasks(): Task[] {
    let result = this.tasks;

    if (this.activeFilter === 'active') {
      result = result.filter(t => t.taskStatus === 'NOT_COMPLETED');
    } else if (this.activeFilter === 'done') {
      result = result.filter(t => t.taskStatus === 'COMPLETED');
    }

    if (this.searchQuery.trim()) {
      result = result.filter(t =>
        t.taskText.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    return result;
  }

  private toDateString(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}