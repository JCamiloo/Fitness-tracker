import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../training.interfaces';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})

export class NewTrainingComponent implements OnInit {

  exercises: Observable<any>;

  constructor(private trainingSrv: TrainingService, private db: AngularFirestore) { }

  ngOnInit() {
    this.exercises = this.db.collection('avalaibleExercises').valueChanges();
  }

  onStartTraining(form: NgForm){
    this.trainingSrv.startExercise(form.value.exercise);
  }
}