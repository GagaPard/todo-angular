import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService)   //Notre service d'identification
  private router = inject(Router)   //El routerino

  email = ''
  password = ''
  username = ''
  loading = signal(false)   //signal permet de modifier une variable et de mettre à jour tout ce qui dépend d'elle
  errorMessage = signal('')
  isRegisterMode = signal(false)

  login() {
    if (!this.email.trim() || !this.password.trim())    //Si il n'y a ni email ni password ou que des espaces vides il se passe R quand il clique
      return

    this.loading.set(true)    //On met le chargement à true
    this.errorMessage.set('')

    this.authService.login(this.email, this.password).subscribe({
      next: () => {   //Après l'authentification réussie
        this.loading.set(false)   //On remet le chargement à false
        this.router.navigate(['/dashboard'])    //On va sur le dashboard
      },
      error : (err) => {    //Si l'authentification échoue
        this.loading.set(false)   //On met le chargement à false
        this.errorMessage.set('Email ou mdp incorrect mon gars, tié un hacker ?')   //On transmet l'erreur à l'utilisateur
      }
    })
  }

  register() {
    if (!this.email.trim() || !this.password.trim() || !this.username.trim())
      return

    this.loading.set(true)
    this.errorMessage.set('')

    this.authService.register(this.email, this.password, this.username).subscribe({
      next: () => {
        this.loading.set(false)
        this.router.navigate(['/dashboard'])  //On peut naviguer direct vu qu'on a intégrer la fonction login à notre register
      },
      error : (err) => {
        this.loading.set(false)
        this.errorMessage.set("Tu peux pas t'inscrire, dommage pour toi je fais de l'IA")
      }
    })
  }

  toggleMode() {
    this.isRegisterMode.set(!this.isRegisterMode()) //On change la valeur du signal
    this.errorMessage.set('') //On efface les messages d'erreurs pour pas s'embrouiller
  }
}
