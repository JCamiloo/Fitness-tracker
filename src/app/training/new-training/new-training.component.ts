import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../training.interfaces';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})

export class NewTrainingComponent implements OnInit {

  exercises: Exercise[] = [];

  constructor(private trainingSrv: TrainingService) { }

  ngOnInit() {
    this.exercises = this.trainingSrv.getAvailableExercises();
  }

  onStartTraining(form: NgForm){
    this.trainingSrv.startExercise(form.value.exercise);
  }
}