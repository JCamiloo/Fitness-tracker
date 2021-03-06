import { UIService } from './../shared/ui.service';
import { AuthData } from './auth.interfaces';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth'
import { TrainingService } from '../training/training.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';

@Injectable()
export class AuthService {

    private isAuthenticated = false;

    constructor(private router: Router, private afAuth: AngularFireAuth,
                private trainingSrv: TrainingService, private UISrv: UIService,
                private store: Store<{ui: fromRoot.State}>){}
    
    initAuthListener(){
        this.afAuth.authState.subscribe(user => {
            if(user) {
                this.store.dispatch(new Auth.SetAuthenticated());
                this.router.navigate(['/training']);
            } else {
                this.trainingSrv.cancelSubscriptions();
                this.router.navigate(['/']);
                this.store.dispatch(new Auth.SetUnauthenticated());
                this.isAuthenticated = false;
            }
        });
    }

    registerUser(authData: AuthData){
        this.store.dispatch(new UI.StartLoading);
        this.afAuth.auth.createUserWithEmailAndPassword(
            authData.email,
            authData.password
        ).then(result => {
            this.store.dispatch(new UI.StopLoading);
        }).catch(error => {
            this.store.dispatch(new UI.StopLoading);
            this.UISrv.showSnackBar(error.message, null, 3000);
        });
    }

    login(authData: AuthData){
        this.store.dispatch(new UI.StartLoading);
        this.afAuth.auth.signInWithEmailAndPassword(
            authData.email,
            authData.password
        ).then(result => {
            this.store.dispatch(new UI.StopLoading);
        }).catch(error => {
            this.store.dispatch(new UI.StopLoading);
            this.UISrv.showSnackBar(error.message, null, 3000);            
        }); 
    }

    logout(){
        this.afAuth.auth.signOut();
    }
}