import { Subject } from 'rxjs/Subject';
import { User, AuthData } from './auth.interfaces';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth'
import { TrainingService } from '../training/training.service';

@Injectable()
export class AuthService {

    authChange = new Subject<boolean>();
    private isAuthenticated = false;

    constructor(private router: Router, private afAuth: AngularFireAuth,
                private trainingSrv: TrainingService ){}
    
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
        this.afAuth.auth.createUserWithEmailAndPassword(
            authData.email,
            authData.password
        ).catch(error => console.log(error));
    }

    login(authData: AuthData){
        this.afAuth.auth.signInWithEmailAndPassword(
            authData.email,
            authData.password
        ).catch(error => console.log(error));
    }

    logout(){
        this.afAuth.auth.signOut();
    }

    isAuth(){
        return this.isAuthenticated;
    }
}