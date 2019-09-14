import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {

  @Output() closeSidenav = new EventEmitter<void>();
  isAuth: boolean;
  authSubscription: Subscription;
  
  constructor(private authSrv: AuthService) { }

  ngOnInit() {
    this.authSubscription = this.authSrv.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }

  onClose(){
    this.closeSidenav.emit();
  }

  onLogout(){
    this.onClose();
    this.authSrv.logout();
  }

  ngOnDestroy(){
    this.authSubscription.unsubscribe();
  }
}
