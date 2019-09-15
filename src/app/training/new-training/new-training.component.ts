import { Exercise } from './../training.interfaces';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})

export class NewTrainingComponent implements OnInit, OnDestroy {

  exercises: Exercise[];
  loadingSubscription: Subscription;
  isLoading$: Observable<boolean>;
  private exerciseSubscription: Subscription;

  constructor(private trainingSrv: TrainingService, private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exerciseSubscription = this.trainingSrv.exercisesChanged.subscribe(exercises => this.exercises = exercises);
    this.fetchExercises();
  }

  fetchExercises(){
    this.trainingSrv.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm){
    this.trainingSrv.startExercise(form.value.exercise);
  }

  ngOnDestroy(){
    this.loadingSubscription && this.loadingSubscription.unsubscribe();
    this.exerciseSubscription && this.exerciseSubscription.unsubscribe();
  }
}