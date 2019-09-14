import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Subscription } from 'rxjs';
import { Exercise } from './training.interfaces';
import { Injectable } from '@angular/core';
import { UIService } from '../shared/ui.service';
import { map } from 'rxjs/operators';

@Injectable()
export class TrainingService {
    
    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();
    private availableExercises: Exercise[] = []; 
    private runningExercise: Exercise;
    private fbSubs: Subscription[] = [];

    constructor(private db: AngularFirestore, private UISrv: UIService) {}

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
        this.UISrv.loadingStateChanged.next(true);
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
            this.UISrv.loadingStateChanged.next(false);
            this.availableExercises = exercises;
            this.exercisesChanged.next([ ...this.availableExercises ]);
        }, error => {
            this.UISrv.loadingStateChanged.next(false);
            this.UISrv.showSnackBar('Fetching exercises failed, please try again later', null, 3000);
            this.exercisesChanged.next(null);
        }));
    }

    getRunningExercise(){
        return { ...this.runningExercise };
    }

    fetchCompletedOrCancelledExercises(){
        this.fbSubs.push(this.db.collection('finishedExercises').valueChanges().subscribe((exercises: Exercise[]) => {
            this.finishedExercisesChanged.next(exercises);
        }));
    }

    private addDataToDatabase(exercise: Exercise){
        this.db.collection('finishedExercises').add(exercise);
    }

    cancelSubscriptions(){
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }
}