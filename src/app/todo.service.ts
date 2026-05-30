import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.model';

@Injectable({ providedIn: 'root' })
export class TodoService {

  private api = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) {}

  getTasksByDate(date: string): Observable<Task[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<Task[]>(`${this.api}/date`, { params });
  }

  addTask(taskText: string, date: string): Observable<Task> {
    const body = {
      taskText,
      taskDate: date,
      taskStatus: 'NOT_COMPLETED'
    };
    return this.http.post<Task>(this.api, body);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  toggleTask(id: number): Observable<Task> {
    return this.http.put<Task>(`${this.api}/${id}/toggle`, {});
  }

  updateTask(id: number, taskText: string): Observable<Task> {
    return this.http.put<Task>(`${this.api}/${id}`, { taskText });
  }
}