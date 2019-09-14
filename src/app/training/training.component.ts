import { TrainingService } from './training.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {

  onGoingTraining = false;
  exerciseSubscription: Subscription;
  
  constructor(private trainingSrv: TrainingService) { }

  ngOnInit() {
    this.exerciseSubscription = this.trainingSrv.exerciseChanged.subscribe(exercise => {
      exercise ? this.onGoingTraining = true : this.onGoingTraining = false;
    });
  }

  ngOnDestroy() {
    this.exerciseSubscription && this.exerciseSubscription.unsubscribe();
  }
}