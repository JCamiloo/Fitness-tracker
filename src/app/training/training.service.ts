import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Subscription } from 'rxjs';
import { Exercise } from './training.interfaces';
import { Injectable } from '@angular/core';
import { UIService } from '../shared/ui.service';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';

@Injectable()
export class TrainingService {
    
    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();
    private availableExercises: Exercise[] = []; 
    private runningExercise: Exercise;
    private fbSubs: Subscription[] = [];

    constructor(private db: AngularFirestore, private UISrv: UIService, private store: Store<fromTraining.State>) {}

    startExercise(selectedId: String){
        this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId); 
        this.exerciseChanged.next({ ...this.runningExercise });
    }

    completeExercise(){
        this.addDataToDatabase({ ...this.runningExercise, date: new Date(), state: 'completed' });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number){
        this.addDataToDatabase({ 
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(), 
            state: 'cancelled'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }
    
    fetchAvailableExercises(){
        this.store.dispatch(new UI.StartLoading());
        this.fbSubs.push(this.db.collection('avalaibleExercises').snapshotChanges().pipe(map(docArray => {
            return docArray.map(doc => {
              return {
                id: doc.payload.doc.id,
                name: doc.payload.doc.data()['name'],
                duration: doc.payload.doc.data()['duration'],
                calories: doc.payload.doc.data()['calories'],
              }
            });
        })).subscribe((exercises: Exercise[]) => {
            this.store.dispatch(new UI.StopLoading());
            this.store.dispatch(new Training.SetAvailableTrainings(exercises));
        }, error => {
            this.store.dispatch(new UI.StopLoading());
            this.UISrv.showSnackBar('Fetching exercises failed, please try again later', null, 3000);
            this.exercisesChanged.next(null);
        }));
    }

    getRunningExercise(){
        return { ...this.runningExercise };
    }

    fetchCompletedOrCancelledExercises(){
        this.fbSubs.push(this.db.collection('finishedExercises').valueChanges().subscribe((exercises: Exercise[]) => {
            this.store.dispatch(new Training.SetFinishedTrainings(exercises));
        }));
    }

    private addDataToDatabase(exercise: Exercise){
        this.db.collection('finishedExercises').add(exercise);
    }

    cancelSubscriptions(){
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }
}