import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';  // ← fix import path and name

describe('TodoService', () => {
  let service: TodoService;  // ← fix type

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoService);  // ← fix inject
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});