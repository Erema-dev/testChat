import { Component, OnInit } from '@angular/core';
import {AuthService} from '../shared/services/auth.service'

@Component({
  selector: 'app-chat-layout',
  templateUrl: './chat-layout.component.html',
  styleUrls: ['./chat-layout.component.css']
})
export class ChatLayoutComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }


}
