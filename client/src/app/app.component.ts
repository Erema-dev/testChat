import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './shared/services/auth.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {

  constructor(private http: HttpClient,
    private auth: AuthService) {
   
  }

  ngOnInit () {
    const potentialToken = localStorage.getItem('auth-token')
    if(potentialToken !== null){
      this.auth.setToken(potentialToken)
    }
  }

}
