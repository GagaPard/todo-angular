import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Task {
  id : string,
  label: string,
  done : boolean
}

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  private http = inject(HttpClient)
  private apiUrl = 'https://todof.woopear.fr/api/v1/task'

  getTasks() : Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}`)
  }

  createTask(label : string) : Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}`, { label })
  }

  deleteTask(taskId : string) : Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${taskId}/user`)
  }

  updateTaskDone(taskId : string, done : boolean) : Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${taskId}/done/user`, { done })
  }

  updateTaskLabel(taskId : string, label : string) : Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${taskId}/label/user`, { label })
  }
}
