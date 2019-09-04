import { Exercise } from './../training.interfaces';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();

  constructor(private trainingSrv: TrainingService) { }

  ngOnInit() {
    this.dataSource.data = this.trainingSrv.getCompletedOrCancelledExercises();
  }

  ngAfterViewInit(){
    this.dataSource.sort = this.sort;
  }
}