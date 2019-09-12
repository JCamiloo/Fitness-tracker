import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard  implements CanActivate, CanLoad {
    
    constructor(private authSrv: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        if (this.authSrv.isAuth()) {
            return true;
        } else {
            this.router.navigate(['/login']);
        } 
    }

    canLoad(route: Route){
        if (this.authSrv.isAuth()) {
            return true;
        } else {
            this.router.navigate(['/login']);
        } 
    }
}