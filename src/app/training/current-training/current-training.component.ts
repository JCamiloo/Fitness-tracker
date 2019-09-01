import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { StopTrainingComponent } from './stop-training.component';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {

  progress = 0;
  timer;
   
  constructor(private dialog: MatDialog, private trainingSrv: TrainingService) { }

  ngOnInit() {
    this.startOrResumeTimer();
  }

  startOrResumeTimer(){
    const step = this.trainingSrv.getRunningExercise().duration / 100 * 1000;
    this.timer = setInterval(() => {
      this.progress = this.progress + 1;
      if(this.progress >= 100){
        this.trainingSrv.completeExercise();
        clearInterval(this.timer);
      }
    }, step);
  }

  onStop(){
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      result ? this.trainingSrv.cancelExercise(this.progress) : this.startOrResumeTimer();
    });
  }
}