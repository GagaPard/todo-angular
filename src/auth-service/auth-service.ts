import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, switchMap, mapTo, map } from 'rxjs';

export interface LoginCredentials {   //Champs à remplir pour se log
  email: string
  password: string
}

export interface LoginResponse {    //La réponse à la connexion : le token d'identification qu'on mettra dans le header de la response
  data: {
    token: string
  }
}

export interface RegisterPayload {
  email: string,
  password : string,
  username : string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient)
  private router = inject(Router)

  //On renseigne l'API
  private apiUrl = 'https://todof.woopear.fr/api/v1/user'


  //Avec les signaux, on vérifie que le token est bien légitime
  isLoggedIn = signal(this.hasValidToken())

  login(email: string, password: string): Observable<LoginResponse> {
  const credentials: LoginCredentials = { email, password };
  return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(    //pipe contient toutes les opérations à effectuer sur le flux d'infos
        tap((response: LoginResponse) => { //tap = je fais ça quand je recois la réponse
          // Stocker le token
          localStorage.setItem('token', response.data.token);
          this.isLoggedIn.set(true)
      })
    )
  }

  //Créer un utilisateur, puis le co grâce à notre login
  register(email : string, password: string, username: string): Observable<LoginResponse>{
    const payload: RegisterPayload = { email, password, username }
    return this.http.post<void>(`${this.apiUrl}/register`, payload)
    .pipe(
      switchMap(() => this.login(email, password)),   //Switchmap permet de changer les observables, le post est un void avec le register (il ne donne pas de token), alors que login renvoie un token, nous n'avons donc pas les mêmes observables
      tap((response) => {
        localStorage.setItem('token', response.data.token)
        this.isLoggedIn.set(true);
      })
    )
  }

  //Supprimer le compte
  deleteAccount(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    })
  }

  //Se déconnecter
  logout(): void {
    localStorage.removeItem('token')
    this.isLoggedIn.set(false)
    this.router.navigate(['/login'])
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }

  private hasValidToken(): boolean {
    const token = this.getToken()
    if (!token)
      return false

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 > Date.now()
    } catch {
      return false
    }
  }
}
