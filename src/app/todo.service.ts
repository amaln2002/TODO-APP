import { Injectable } from '@angular/core';
import { Task } from './task.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private tasks: Task[] = [];
  
  constructor() {
    this.loadFromStorage();
  }

  getTasks(date: string): Task[] {
    return this.tasks.filter(t => t.date === date);
  }

  addTask(title: string, date: string): void {
    this.tasks.push({
      id: crypto.randomUUID(),
      title,
      completed: false,
      date
    });
    this.save();
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.save();
  }

  toggleTask(id: string): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.save();
    }
  }

  private save(): void {
    localStorage.setItem('ng_tasks', JSON.stringify(this.tasks));
  }

private loadFromStorage(): void {
  const saved = localStorage.getItem('ng_tasks');
  
  if (saved !== null) {
    const parsedTasks = JSON.parse(saved);
    this.tasks = parsedTasks;
  } else {
    this.tasks = [];
  }
}
}