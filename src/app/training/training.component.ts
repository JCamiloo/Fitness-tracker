import { TrainingService } from './training.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {

  onGoingTraining = false;
  exerciseSubscription: Subscription;
  
  constructor(private trainingSrv: TrainingService) { }

  ngOnInit() {
    this.exerciseSubscription = this.trainingSrv.exerciseChanged.subscribe(exercise => {
      exercise ? this.onGoingTraining = true : this.onGoingTraining = false;
    });
  }
}