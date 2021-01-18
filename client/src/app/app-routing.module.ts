import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/classes/auth.guard';
import {AuthLayoutComponent} from './auth-layout/auth-layout.component'
import {LoginPageComponent} from './login-page/login-page.component'
import {RegisterPageComponent} from './register-page/register-page.component'
import {MessagesPageComponent} from './messages-page/messages-page.component'
import {ChatLayoutComponent} from './chat-layout/chat-layout.component'


const routes: Routes = [ {
  path: '', 
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginPageComponent
      },
      {
        path: '', redirectTo: '/login', pathMatch: 'full'
      }
    ]
  },
  {
    path: 'chat', 
    component: MessagesPageComponent, 
    canActivate: [AuthGuard],
  }
    
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
