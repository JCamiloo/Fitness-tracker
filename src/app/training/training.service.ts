import { Store } from '@ngrx/store';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Subscription } from 'rxjs';
import { Exercise } from './training.interfaces';
import { Injectable } from '@angular/core';
import { UIService } from '../shared/ui.service';
import { map, take } from 'rxjs/operators';
import * as UI from '../shared/ui.actions';
import * as Training  from './training.actions';
import * as fromTraining from './training.reducer';

@Injectable()
export class TrainingService {
    
    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();
    private fbSubs: Subscription[] = [];

    constructor(private db: AngularFirestore, private UISrv: UIService, 
                private store: Store<fromTraining.State>) {}

    startExercise(selectedId: string){
        this.store.dispatch(new Training.StartTraining(selectedId));
    }

    completeExercise(){
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({ ...ex, date: new Date(), state: 'completed' });
            this.store.dispatch(new Training.StopTraining());
        });
    }

    cancelExercise(progress: number){
        this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
            this.addDataToDatabase({
                ...ex,
                duration: ex.duration * (progress / 100),
                calories: ex.calories * (progress / 100),
                date: new Date(), 
                state: 'cancelled'
            });
            this.store.dispatch(new Training.StopTraining());
        });
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
            console.log('exercises', exercises);
            this.store.dispatch(new UI.StopLoading());
            this.store.dispatch(new Training.SetAvailableTrainings(exercises));
        }, error => {
            this.store.dispatch(new UI.StopLoading());
            this.UISrv.showSnackBar('Fetching exercises failed, please try again later', null, 3000);
        }));
    }

    fetchCompletedOrCancelledExercises(){
        this.fbSubs.push(this.db.collection('finishedExercises').valueChanges().subscribe((exercises: Exercise[]) => {
            this.store.dispatch(new Training.SetAvailableTrainings(exercises));
        }));
    }

    private addDataToDatabase(exercise: Exercise){
        this.db.collection('finishedExercises').add(exercise);
    }

    cancelSubscriptions(){
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }
}