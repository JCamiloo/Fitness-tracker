import { UIService } from './../shared/ui.service';
import { Subject } from 'rxjs/Subject';
import { User, AuthData } from './auth.interfaces';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth'
import { TrainingService } from '../training/training.service';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class AuthService {

    authChange = new Subject<boolean>();
    private isAuthenticated = false;

    constructor(private router: Router, private afAuth: AngularFireAuth,
                private trainingSrv: TrainingService, private snackBar: MatSnackBar,
                private UISrv: UIService){}
    
    initAuthListener(){
        this.afAuth.authState.subscribe(user => {
            if(user) {
                this.isAuthenticated = true;
                this.authChange.next(true);
                this.router.navigate(['/training']);
            } else {
                this.trainingSrv.cancelSubscriptions();
                this.authChange.next(false);
                this.router.navigate(['/login']);
                this.isAuthenticated = false;
            }
        });
    }

    registerUser(authData: AuthData){
        this.UISrv.loadingStateChanged.next(true);
        this.afAuth.auth.createUserWithEmailAndPassword(
            authData.email,
            authData.password
        ).then(result => {
            this.UISrv.loadingStateChanged.next(false);
        }).catch(error => {
            this.UISrv.loadingStateChanged.next(false);
            this.snackBar.open(error.message, null, {
                duration: 3000
            });
        });
    }

    login(authData: AuthData){
        this.UISrv.loadingStateChanged.next(true);
        this.afAuth.auth.signInWithEmailAndPassword(
            authData.email,
            authData.password
        ).then(result => {
            this.UISrv.loadingStateChanged.next(false);
        }).catch(error => {
            this.UISrv.loadingStateChanged.next(false);
            this.snackBar.open(error.message, null, {
                duration: 3000
            });
        });
    }

    logout(){
        this.afAuth.auth.signOut();
    }

    isAuth(){
        return this.isAuthenticated;
    }
}