import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventosComponent } from './eventos/eventos.component';
import { EventoEditComponent } from './eventos/eventoEdit/eventoEdit.component';
import { PalestranteComponent } from './palestrante/palestrante.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContatosComponent } from './contatos/contatos.component';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  // login e registration são filhos de user
  {path: 'user', component: UserComponent,
children: [
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
]},
  // canActivate é do Guard que tem função de não deixar direcionar para uma pagina quando não está logado
  {path: 'eventos', component: EventosComponent, canActivate: [AuthGuard]},
  {path: 'evento/:id/edit', component: EventoEditComponent, canActivate: [AuthGuard]},
  {path: 'palestrante', component: PalestranteComponent, canActivate: [AuthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'contatos', component: ContatosComponent, canActivate: [AuthGuard]},
  // Se não encontrar alguma URL manda para dashboard
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
