import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import {io} from 'node_modules/socket.io-client'

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnInit, OnDestroy {

  socket : any
  token: any


  constructor() {
    this.token = localStorage.getItem('auth-token')
    this.socket = io('localhost:5000', { query: {token: this.token} });
  }


  ngOnInit() {
    console.log(this.token)
  }

  ngOnDestroy(){
  }


  listen(eventName:String){
    return new Observable( (subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data)
      })
    })
  } 

  emit(eventName: String, data: any){
    this.socket.emit(eventName, data)
  }

  
}

