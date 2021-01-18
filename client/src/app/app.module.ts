import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { RegisterPageComponent } from './register-page/register-page.component';
import { MessagesPageComponent } from './messages-page/messages-page.component'
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { ChatLayoutComponent } from './chat-layout/chat-layout.component';
import {MatGridListModule} from '@angular/material/grid-list'


@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    RegisterPageComponent,
    MessagesPageComponent,
    AuthLayoutComponent,
    ChatLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    [MatButtonModule,
      MatInputModule,
      BrowserAnimationsModule,
      MatGridListModule,]
  ],
  exports:[
    MatInputModule,
    MatButtonModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
