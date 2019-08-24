import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SignupComponent } from './auth/signup/signup.component';
import { TrainingComponent } from './training/training.component';
import { CurrentTrainingComponent } from './training/current-training/current-training.component';
import { PastTrainingsComponent } from './training/past-trainings/past-trainings.component';
import { NewTrainingComponent } from './training/new-training/new-training.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './auth/login/login.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    TrainingComponent,
    CurrentTrainingComponent,
    PastTrainingsComponent,
    NewTrainingComponent,
    WelcomeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
