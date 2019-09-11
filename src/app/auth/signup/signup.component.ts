import { UIService } from './../../shared/ui.service';
import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  maxDate;
  isLoading;
  private loadingSubs: Subscription;

  constructor(private authSrv: AuthService, private UISrv: UIService) { }

  ngOnInit() {
    this.loadingSubs = this.UISrv.loadingStateChanged.subscribe(isLoading => this.isLoading = isLoading);
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit(form:NgForm){
    console.log(form);
    this.authSrv.registerUser({
      email: form.value.email,
      password: form.value.password
    });
  }

  ngOnDestroy(){
    this.loadingSubs && this.loadingSubs.unsubscribe();
  }
}
