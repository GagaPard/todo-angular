import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth-service/auth-service';
import { HttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [JsonPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService)
  private http = inject(HttpClient)

  ngOnInit() {
    this.loadData()
  }

  // variable disponible pour savoir si l'utilisateur est connecté
  isLoggedIn = this.authService.isLoggedIn
  data: any = null
  username : string = ''

  logout() {
    this.authService.logout()
  }

  loadData() {
    if (this.data) {
      this.data = null
      return
    }

    // Le token sera automatiquement ajouté par l'intercepteur
    this.http.get('https://todof.woopear.fr/api/v1/user/profil').subscribe({
      next: (res: any) => {
        this.data = res,
        this.username = res.data.username
      },
      error: (err) => console.error('Erreur:', err)
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
}
