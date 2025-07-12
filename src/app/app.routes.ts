import { Routes } from '@angular/router';
import { Login } from '../login/login';
import { authGuard } from '../auth-service/authguard';

export const routes: Routes = [
    { path : 'login', component: Login },
    {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('../dashboard/dashboard').then(m => m.Dashboard)
    },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }

]
