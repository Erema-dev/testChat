import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../shared/interfaces/interfaces';
import { AuthService } from '../shared/services/auth.service'



@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  aSub: Subscription

  @Output() onSub = new EventEmitter()
  @ViewChild('titlePassword', {static: false}) inputRef: ElementRef
  
  constructor(private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      login: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(5)
      ])
    })

    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        alert('Теперь вы можете войти в систему со своими данными для входа')
      } else if (params['accessDenied']) {
        alert('Войдите в систему, используя свой логин и пароль')
      } else if (params['sessionFailed']) {
        alert('Время сессии истекло, повторите пожалуйста вход')
      } else if (params['banUser']) {
        alert('Вы были забанены')
      } else if (params['kickUser']) {
        alert('Вы вошли с другого устройства')
      }
    })
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

  onSubmit() {
    this.form.disable()
    this.aSub = this.auth.login(this.form.value).subscribe(
      () => {
        this.router.navigate(['chat'])
      },

      (error) => {
        alert(error.error.message)
        this.form.enable()
        this.inputRef.nativeElement.focus()
        this.form.get('password').reset()
      })

  }
}

