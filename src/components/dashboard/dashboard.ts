import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth-service';
import { HttpClient } from '@angular/common/http';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../../services/task-service/task-service';
import { TaskComponent } from "../task/task";

@Component({
  selector: 'app-dashboard',
  imports: [JsonPipe, FormsModule, CommonModule, TaskComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService)
  private taskService = inject(TaskService)
  private http = inject(HttpClient)

  ngOnInit() {
    this.loadUsername()
    this.loadTasks()
  }

  // variable disponible pour savoir si l'utilisateur est connecté
  isLoggedIn = this.authService.isLoggedIn
  data: any = null
  username : string = ''

  tasks : Task[] = []
  newTaskLabel : string = ''

  logout() {
    this.authService.logout()
  }

  loadUsername(){
    this.http.get('https://todof.woopear.fr/api/v1/user/profil').subscribe({
      next: (res:any) => {
        this.username = res.data.username
      },
      error: (err) => console.error("T'as de nom toi ? T'es complètement déglingo du ciboulot", err)
    })
  }

  loadData() {
    if (this.data) {
      this.data = null
      return
    }

    // Le token sera automatiquement ajouté par l'intercepteur
    this.http.get('https://todof.woopear.fr/api/v1/user/profil').subscribe({
      next: (res: any) => {
        this.data = res
        this.username = res.data.username       
      },
      error: (err) => console.error('Bah y a pas de data là ???', err)
    })
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (res : any) => {
        this.tasks = res.data
      },
      error: (err) => console.error("On trouve pas tes tâches mon gars c'est bizarre hein", err)
    })
  }

  deleteAccount() {
    if (confirm("Tié sûr que tu veux mourir ? C'est irréversible askip")) {
      this.authService.deleteAccount().subscribe({
        next: () => {
          this.authService.logout()
          alert("Salut mon pote ")
        },
        error: () => {
          alert("C'EST MORT TU SERAS AVEC NOUS A JAMAIS AHAHAHAHAHAH (en vrai jsp pourquoi ça marche pas là...)")
        }
      })
    }
  }

  createTask() {
    if (!this.newTaskLabel.trim()) 
      return

    this.taskService.createTask(this.newTaskLabel.trim()).subscribe({
      next: (newTask) => {
        this.tasks.push(newTask)
        this.newTaskLabel = ''
        this.loadTasks()
      },
      error: (err) => console.error('Bah apparemment tu vas rien faire du tout chacal hein', err)
    })
  }

  updateTask(updatedTask: Task) {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id)
      this.loadTasks()
  }

  deleteTask(id: string) {
    this.tasks = this.tasks.filter(task => task.id !== id)   
  }
}
