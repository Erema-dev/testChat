import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../shared/interfaces/interfaces';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  form: FormGroup
  aSub: Subscription
  
  @Output() onSub = new EventEmitter()

  constructor(
    private auth:AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      login: new FormControl('',[
        Validators.required
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(5)
      ])
    })
  }

  onSubmit() {
    this.form.disable()
     this.aSub = this.auth.register(this.form.value).subscribe(
      () => {
        console.log('Регистрация прошла успешно')
        this.router.navigate(['/login'],{
          queryParams:{
            registered: true
          }
        })
      },
      (error) => {
        console.log(error.error.message)
        this.form.enable()
  }
     )
}


}
