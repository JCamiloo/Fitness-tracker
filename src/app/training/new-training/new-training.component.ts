import { Exercise } from './../training.interfaces';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})

export class NewTrainingComponent implements OnInit, OnDestroy {

  exercises: Exercise[];
  exerciseSubscription: Subscription;
  loadingSubscription: Subscription;
  isLoading = false;

  constructor(private trainingSrv: TrainingService, private UISrv: UIService) { }

  ngOnInit() {
    this.loadingSubscription = this.UISrv.loadingStateChanged.subscribe(isLoading => this.isLoading = isLoading);
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
    this.exerciseSubscription.unsubscribe();
  }
}