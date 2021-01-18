import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { WebSocketService } from '../shared/services/web-socket.service';
import { dataMessage } from '../shared/interfaces/interfaces'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { User } from '../shared/interfaces/interfaces'
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';


@Component({
  selector: 'app-messages-page',
  templateUrl: './messages-page.component.html',
  styleUrls: ['./messages-page.component.css']
})
export class MessagesPageComponent implements OnInit, OnDestroy {



  constructor(private WebSocketService: WebSocketService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute) {

  }

  socket: any
  messages: dataMessage[] = []
  user: User
  onlineUsers: User[]
  offlineUsers: User[]
  form: FormGroup

  token = localStorage.getItem('auth-token')

  ngOnInit(): void {

    this.form = new FormGroup({
      text: new FormControl('', [
        Validators.required,
        Validators.maxLength(200)
      ])
    })

    this.WebSocketService.listen('user join').subscribe((data: User) => { this.user = data; })

    this.WebSocketService.listen('online users').subscribe((data: User[]) => { this.onlineUsers = data })

    this.WebSocketService.listen('new user').subscribe((data) => { this.chatBot(data) })

    this.WebSocketService.listen('user left').subscribe((data) => { this.chatBot(data + ' disconnect') })

    this.WebSocketService.listen('new message').subscribe((data: dataMessage) => {
      if (data) { this.messages.push(data) }
    })

    this.WebSocketService.listen('offline users').subscribe((data: User[]) => this.offlineUsers = data);

    this.WebSocketService.listen('you mute').subscribe((data: User) => {
      this.chatBot('You are mute now');
      this.user = data;
    })

    this.WebSocketService.listen('you ban').subscribe(() => {
      localStorage.clear()
      this.token = null
      this.router.navigate(['/login'], {
        queryParams: {
          banUser: true
        }
      })
    })

    this.WebSocketService.listen('you unmute').subscribe((data: User) => {
      this.chatBot('You are unmute now');
      this.user = data
    })

    this.WebSocketService.listen('get messages').subscribe((data: dataMessage[]) => { this.messages = data.reverse() })


    this.WebSocketService.listen('kick').subscribe(() => {
      console.log('kick')
      localStorage.clear()
      this.token = null
      this.router.navigate(['/login'], {
        queryParams: {
          kickUser: true
        }
      }
      )
    })

  }

  ngOnDestroy() {
  
  }

  resetMessages() {
    this.messages = []
    event.preventDefault()
  }

  onSubmit() {
    if (!this.user.isMute) {
      const newMessage: dataMessage = {

        text: this.form.value
      }
      this.WebSocketService.emit('new message', {
        text: this.form.get('text').value,
      })

    } else {
      alert("You can't send a message")
      this.chatBot('you are mute now')
    }
    this.form.reset()
  }

  muteUser(banUserId) {
    this.WebSocketService.emit('mute user', banUserId)
  }

  unMuteUser(banUserId) {
    this.WebSocketService.emit('unmute user', banUserId)
  }

  banUser(banUserId) {
    this.WebSocketService.emit('ban user', banUserId)
  }

  unBanUser(banUserId) {
    this.WebSocketService.emit('unban user', banUserId)
  }

  chatBot(textChat) {
    this.messages.push({
      userName: 'ChatBot',
      text: textChat
    });
  }

  getOffline() {
    if (this.user.isAdmin) this.WebSocketService.emit('get offline', {})
  }

  logout() {
    localStorage.clear()
    this.token = null
    this.router.navigate(['/login'])
    this.WebSocketService.emit('logout', this.user._id)
    event.preventDefault()
  }
}
