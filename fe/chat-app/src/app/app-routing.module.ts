// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { LoginComponent } from './components/login/login.component';
import { ChatComponent } from './components/chat/chat.component';
// import { AuthGuard } from './guards/auth.guard'; // Auth guard to protect routes

const routes: Routes = [
  // { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterComponent },
  { path: 'chat', component: ChatComponent }, // Protected route
  { path: '', redirectTo: '/chat', pathMatch: 'full' }, // Redirect to login if no route is specified
  { path: '**', redirectTo: '/chat' } // Wildcard route to handle undefined paths
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
