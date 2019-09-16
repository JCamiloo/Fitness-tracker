import { Exercise } from './../training.interfaces';
import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})

export class NewTrainingComponent implements OnInit {

  exercises$: Observable<Exercise[]>;
  isLoading$: Observable<boolean>;

  constructor(private trainingSrv: TrainingService, private store: Store<fromTraining.State>) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
    this.store.select(fromTraining.getAvailableExercises).subscribe(data => console.log('data',data));
    this.fetchExercises();
  }

  fetchExercises(){
    this.trainingSrv.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm){
    this.trainingSrv.startExercise(form.value.exercise);
  }
}