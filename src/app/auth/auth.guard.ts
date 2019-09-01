import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard  implements CanActivate {
    
    constructor(private authSrv: AuthService, private router: Router){
        
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        if (this.authSrv.isAuth()) {
            return true;
        } else {
            this.router.navigate(['/login']);
        } 
    }
}