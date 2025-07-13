import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskService, Task } from '../../services/task-service/task-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task',
  imports: [FormsModule, CommonModule],
  templateUrl: './task.html',
  styleUrl: './task.css'
})
export class TaskComponent {
  @Input() task!: Task  //Reçoit les tasks du dashboard pour pouvoir les traiter ici
  @Output() taskDeleted = new EventEmitter<string>()  //On va envoyer à dash board l'id de la task supprimé, on utilise output car c'est de l'enfant au parent

  isEditing = false
  newLabel = ''

  constructor(private taskService: TaskService) {}

  toggleDone() {
    this.taskService.updateTaskDone(this.task.id, !this.task.done).subscribe((updatedTask) => {
      this.task.done = updatedTask.done
    })
  }

  startEdit() {
    this.isEditing = true
    this.newLabel = this.task.label
  }

  saveEdit() {
    if (!this.newLabel.trim()) return;
    this.taskService.updateTaskLabel(this.task.id, this.newLabel.trim()).subscribe((updatedTask) => {
      this.task.label = updatedTask.label
      this.isEditing = false
    });
  }

  cancelEdit() {
    this.isEditing = false
    this.newLabel = ''
  }

  deleteTask() {
    if (confirm(`Tu veux vraiment envoyer paître en enfer "${this.task.label}" ?`)) {
      this.taskService.deleteTask(this.task.id).subscribe(() => {
        this.taskDeleted.emit(this.task.id) //Envoie l'ID de la tâche supprimée pour que dashboard mette à jour
      })
    }
  }
}
