import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  constructor(private authSrv: AuthService) { }

  loginForm:FormGroup;

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', { validators: [ Validators.required, Validators.email ] }),
      password: new FormControl('', { validators: [ Validators.required ] }),
    });
  }

  onSubmit(form:NgForm){
    console.log(form);
    this.authSrv.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }

}
